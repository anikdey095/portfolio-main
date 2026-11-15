import dns from "node:dns";
import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as {
  __mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalForMongoose.__mongooseCache ?? {
  conn: null,
  promise: null,
};
globalForMongoose.__mongooseCache = cached;

export function sanitizeDbError(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "string"
      ? err
      : "Database operation failed.";

  return raw
    .replace(/mongodb(?:\+srv)?:\/\/[^\s"'`]+/gi, "[redacted-mongodb-uri]")
    .replace(/(password|pwd|secret|token)=[^\s&]+/gi, "$1=[redacted]");
}

function resolveMongoUri(): string {
  return process.env.MONGODB_URI?.trim() || "";
}

async function expandSrvUriWithResolver(srvUri: string): Promise<string> {
  const match = srvUri.match(
    /^mongodb\+srv:\/\/([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?$/i
  );
  if (!match) {
    throw new Error("Invalid mongodb+srv connection string.");
  }

  const [, auth, host, dbPath = "/portfolio", queryStr = ""] = match;
  const resolver = new dns.promises.Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);

  const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${host}`);
  if (!srvRecords || srvRecords.length === 0) {
    throw new Error(`No SRV records resolved for ${host}`);
  }

  const hosts = srvRecords
    .map((r) => `${r.name.replace(/\.$/, "")}:${r.port || 27017}`)
    .join(",");

  const params = new URLSearchParams(queryStr.startsWith("?") ? queryStr.slice(1) : queryStr);
  if (!params.has("ssl") && !params.has("tls")) {
    params.set("tls", "true");
  }

  try {
    const txtRecords = await resolver.resolveTxt(host);
    if (txtRecords.length > 0) {
      const txtParams = new URLSearchParams(txtRecords[0].join(""));
      for (const [k, v] of txtParams.entries()) {
        if (!params.has(k)) {
          params.set(k, v);
        }
      }
    }
  } catch {
    // TXT record lookup is optional if authSource/replicaSet are specified
  }

  return `mongodb://${auth}@${hosts}${dbPath}?${params.toString()}`;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (typeof window !== "undefined") {
    throw new Error("Database connections are restricted to the server.");
  }

  const uri = resolveMongoUri();
  if (!uri) {
    throw new Error("MONGODB_URI is not configured in the server environment.");
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const connectOpts = {
      dbName: "portfolio",
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    if (uri.startsWith("mongodb+srv://")) {
      const currentServers = dns.getServers();
      const hasLoopbackOrSiteLocal =
        currentServers.length === 0 ||
        currentServers.some(
          (s) => s === "127.0.0.1" || s === "::1" || s.startsWith("fec0:")
        );
      if (hasLoopbackOrSiteLocal) {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
        dns.promises.setServers(["8.8.8.8", "1.1.1.1"]);
      }
    }

    cached.promise = (async () => {
      try {
        return await mongoose.connect(uri, connectOpts);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          uri.startsWith("mongodb+srv://") &&
          /querySrv|ECONNREFUSED|ENOTFOUND/i.test(msg)
        ) {
          const directUri = await expandSrvUriWithResolver(uri);
          return await mongoose.connect(directUri, connectOpts);
        }
        throw err;
      }
    })().catch((err) => {
      cached.promise = null;
      throw new Error(`MongoDB connection failed: ${sanitizeDbError(err)}`);
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw new Error(sanitizeDbError(err));
  }
}
