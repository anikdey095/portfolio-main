"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Cpu } from "lucide-react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number; // width/height in px
  className?: string;
  priority?: boolean;
}

export function Avatar({
  src = "/profile.jpg",
  alt = "Anik Dey",
  size = 96,
  className = "",
  priority = false,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative inline-block rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-500 via-teal-400 to-indigo-500 shadow-[0_0_25px_rgba(6,182,212,0.35)] group ${className}`}
      style={{ width: size + 4, height: size + 4 }}
    >
      <div className="w-full h-full rounded-2xl overflow-hidden bg-[var(--bg-card)] flex items-center justify-center relative border border-black/40">
        {!hasError ? (
          <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            priority={priority}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center text-cyan-400">
            <span className="font-mono text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              AD
            </span>
            <span className="text-[9px] font-mono text-[var(--text-muted)] tracking-wider uppercase mt-0.5">
              AI / DL
            </span>
          </div>
        )}
      </div>

      {/* Online Status Beacon */}
      <div
        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--bg-primary)] flex items-center justify-center"
        title="Active: Available for AI/ML Roles & Research"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
      </div>
    </div>
  );
}
