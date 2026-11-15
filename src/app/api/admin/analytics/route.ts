import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

type DateRangeKey = "today" | "7d" | "30d" | "90d" | "custom";

interface VercelAggregateRow {
  key?: string;
  total?: number;
  devices?: number;
  visitors?: number;
  pageViews?: number;
  views?: number;
  [k: string]: unknown;
}

function resolveDateWindow(
  range: DateRangeKey,
  fromParam?: string | null,
  toParam?: string | null
): { since: string; until: string; timeUnit: "hour" | "day" } {
  const now = new Date();
  const until = now.toISOString();

  if (range === "custom" && fromParam && toParam) {
    const start = new Date(fromParam);
    const end = new Date(toParam);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end) {
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return {
        since: start.toISOString(),
        until: end.toISOString(),
        timeUnit: diffDays <= 2 ? "hour" : "day",
      };
    }
  }

  if (range === "today") {
    const start = new Date(now);
    start.setUTCHours(0, 0, 0, 0);
    return { since: start.toISOString(), until, timeUnit: "hour" };
  }

  const daysMap: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };
  const days = daysMap[range] ?? 7;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { since: start.toISOString(), until, timeUnit: "day" };
}

function normalizeRows(raw: unknown, dimensionKey: string) {
  const arr: VercelAggregateRow[] = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { data?: unknown[] })?.data)
    ? ((raw as { data: VercelAggregateRow[] }).data)
    : [];

  return arr.map((row) => {
    const label = String(
      row[dimensionKey] ?? row.key ?? "Unknown"
    ).trim() || "Direct / Unknown";
    const visitors = Number(row.devices ?? row.visitors ?? row.total ?? 0) || 0;
    const pageViews = Number(row.total ?? row.pageViews ?? row.views ?? visitors) || 0;
    return { label, visitors, pageViews };
  });
}

async function queryVercelAnalytics(
  token: string,
  projectId: string,
  teamId: string | undefined,
  since: string,
  until: string,
  by: string,
  limit = 20
) {
  const url = new URL("https://api.vercel.com/v1/query/web-analytics/visits/aggregate");
  url.searchParams.set("projectId", projectId);
  if (teamId) url.searchParams.set("teamId", teamId);
  url.searchParams.set("since", since);
  url.searchParams.set("until", until);
  url.searchParams.set("by", by);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => null);
    const errMsg =
      errJson?.error?.message || `Vercel Analytics API returned HTTP ${res.status}`;
    throw new Error(errMsg);
  }

  return res.json();
}

export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = process.env.VERCEL_API_TOKEN?.trim();
  const projectId = process.env.VERCEL_PROJECT_ID?.trim();
  const teamId = process.env.VERCEL_TEAM_ID?.trim() || undefined;

  if (!token || !projectId) {
    return NextResponse.json({
      configured: false,
      available: false,
      message:
        "Vercel Web Analytics API credentials (VERCEL_API_TOKEN, VERCEL_PROJECT_ID) are not configured yet.",
    });
  }

  const { searchParams } = new URL(req.url);
  const rawRange = (searchParams.get("range") || "7d") as DateRangeKey;
  const range: DateRangeKey = ["today", "7d", "30d", "90d", "custom"].includes(rawRange)
    ? rawRange
    : "7d";
  const { since, until, timeUnit } = resolveDateWindow(
    range,
    searchParams.get("from"),
    searchParams.get("to")
  );

  try {
    const [
      timeseriesRaw,
      pagesRaw,
      countriesRaw,
      devicesRaw,
      browsersRaw,
      osRaw,
      referrersRaw,
    ] = await Promise.all([
      queryVercelAnalytics(token, projectId, teamId, since, until, timeUnit, 90),
      queryVercelAnalytics(token, projectId, teamId, since, until, "requestPath", 15),
      queryVercelAnalytics(token, projectId, teamId, since, until, "country", 15),
      queryVercelAnalytics(token, projectId, teamId, since, until, "deviceType", 10),
      queryVercelAnalytics(token, projectId, teamId, since, until, "browserName", 10),
      queryVercelAnalytics(token, projectId, teamId, since, until, "osName", 10),
      queryVercelAnalytics(token, projectId, teamId, since, until, "referrerHostname", 15),
    ]);

    const timeseries = normalizeRows(timeseriesRaw, timeUnit);
    const topPages = normalizeRows(pagesRaw, "requestPath");
    const countries = normalizeRows(countriesRaw, "country");
    const devices = normalizeRows(devicesRaw, "deviceType");
    const browsers = normalizeRows(browsersRaw, "browserName");
    const operatingSystems = normalizeRows(osRaw, "osName");
    const referrers = normalizeRows(referrersRaw, "referrerHostname");

    const totalVisitors = timeseries.reduce((acc, r) => acc + r.visitors, 0);
    const totalPageViews = timeseries.reduce((acc, r) => acc + r.pageViews, 0);
    const uniqueVisitors = totalVisitors;

    return NextResponse.json({
      configured: true,
      available: true,
      range,
      since,
      until,
      summary: {
        totalVisitors,
        uniqueVisitors,
        totalPageViews,
      },
      timeseries,
      topPages,
      countries,
      devices,
      browsers,
      operatingSystems,
      referrers,
    });
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Failed to fetch Vercel Web Analytics.";
    return NextResponse.json({
      configured: true,
      available: false,
      range,
      since,
      until,
      message: msg,
    });
  }
}
