"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  Globe,
  Monitor,
  Users,
  Eye,
  RefreshCw,
  AlertCircle,
  Calendar,
  ExternalLink,
} from "lucide-react";

type RangeOption = "today" | "7d" | "30d" | "90d" | "custom";

interface AnalyticsRow {
  label: string;
  visitors: number;
  pageViews: number;
}

interface AnalyticsPayload {
  configured: boolean;
  available: boolean;
  message?: string;
  range?: RangeOption;
  summary?: {
    totalVisitors: number;
    uniqueVisitors: number;
    totalPageViews: number;
  };
  timeseries?: AnalyticsRow[];
  topPages?: AnalyticsRow[];
  countries?: AnalyticsRow[];
  devices?: AnalyticsRow[];
  browsers?: AnalyticsRow[];
  operatingSystems?: AnalyticsRow[];
  referrers?: AnalyticsRow[];
}

function BreakdownCard({
  title,
  rows,
  emptyLabel = "No data for this period",
}: {
  title: string;
  rows: AnalyticsRow[];
  emptyLabel?: string;
}) {
  const maxVal = Math.max(...rows.map((r) => r.pageViews || r.visitors), 1);

  return (
    <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3">
      <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
        {title}
      </h4>
      {rows.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] py-4">{emptyLabel}</p>
      ) : (
        <div className="space-y-2.5">
          {rows.slice(0, 8).map((row) => {
            const metric = row.pageViews || row.visitors;
            const pct = Math.max(4, Math.round((metric / maxVal) * 100));
            return (
              <div key={row.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-[var(--text-primary)] truncate font-mono">
                    {row.label}
                  </span>
                  <span className="text-[var(--text-secondary)] font-mono shrink-0">
                    {metric.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bg-primary)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-500/80"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminAnalyticsPanel() {
  const [range, setRange] = useState<RangeOption>("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ range });
      if (range === "custom" && customFrom && customTo) {
        params.set("from", customFrom);
        params.set("to", customTo);
      }
      const res = await fetch(`/api/admin/analytics?${params.toString()}`, {
        credentials: "same-origin",
        cache: "no-store",
      });
      const json = await res.json();
      setAnalytics(json);
    } catch {
      setAnalytics({
        configured: false,
        available: false,
        message: "Failed to load analytics endpoint.",
      });
    } finally {
      setLoading(false);
    }
  }, [range, customFrom, customTo]);

  useEffect(() => {
    if (range !== "custom" || (customFrom && customTo)) {
      loadAnalytics();
    }
  }, [range, customFrom, customTo, loadAnalytics]);

  const rangeButtons: { key: RangeOption; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "7d", label: "Last 7 days" },
    { key: "30d", label: "Last 30 days" },
    { key: "90d", label: "Last 90 days" },
    { key: "custom", label: "Custom" },
  ];

  const timeseries = analytics?.timeseries || [];
  const maxSeriesVal = Math.max(
    ...timeseries.map((d) => d.pageViews || d.visitors),
    1
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Controls */}
      <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <BarChart3 className="w-4 h-4 text-[#0ea5e9]" />
            <span>Visitor Analytics (Vercel Web Analytics)</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Live traffic metrics queried server-side via the official Vercel Web Analytics API.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {rangeButtons.map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => setRange(btn.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                range === btn.key
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                  : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
              }`}
            >
              {btn.label}
            </button>
          ))}
          <button
            type="button"
            onClick={loadAnalytics}
            disabled={loading}
            className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-cyan-400"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {range === "custom" && (
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-wrap items-center gap-3 text-xs font-mono">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <label className="text-[var(--text-secondary)]">From:</label>
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          />
          <label className="text-[var(--text-secondary)]">To:</label>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          />
        </div>
      )}

      {loading ? (
        <div className="p-10 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-center text-xs font-mono text-[var(--text-muted)]">
          Querying Vercel Web Analytics...
        </div>
      ) : !analytics?.configured || !analytics?.available ? (
        <div className="p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-amber-950/15 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {!analytics?.configured
                ? "Vercel Analytics API Not Configured Yet"
                : "Analytics Data Currently Unavailable"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {analytics?.message ||
              "Configure VERCEL_API_TOKEN and VERCEL_PROJECT_ID (plus optional VERCEL_TEAM_ID) in your environment variables, and enable Web Analytics in your Vercel Dashboard."}
          </p>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            <code>@vercel/analytics</code> is already embedded in the root layout to collect privacy-safe production page views once deployed to Vercel.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Total Visitors</span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {(analytics.summary?.totalVisitors ?? 0).toLocaleString()}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unique Visitors</span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {(analytics.summary?.uniqueVisitors ?? 0).toLocaleString()}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Total Page Views</span>
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {(analytics.summary?.totalPageViews ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Traffic Over Time */}
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Visitor Traffic Over Time
              </h4>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Page views &amp; visitors
              </span>
            </div>
            {timeseries.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] py-6 text-center">
                No traffic recorded in this time window yet.
              </p>
            ) : (
              <div className="flex items-end gap-1.5 h-36 pt-4 overflow-x-auto">
                {timeseries.map((pt) => {
                  const val = pt.pageViews || pt.visitors;
                  const hPct = Math.max(6, Math.round((val / maxSeriesVal) * 100));
                  return (
                    <div
                      key={pt.label}
                      className="flex-1 min-w-[14px] flex flex-col items-center gap-1 group"
                      title={`${pt.label}: ${pt.pageViews} views (${pt.visitors} visitors)`}
                    >
                      <div className="w-full flex items-end justify-center h-28">
                        <div
                          className="w-full max-w-[24px] rounded-t bg-cyan-500/75 group-hover:bg-cyan-400 transition-colors"
                          style={{ height: `${hPct}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-[var(--text-muted)] truncate max-w-[44px]">
                        {pt.label.slice(5, 10) || pt.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Breakdowns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <BreakdownCard
              title="Top Visited Pages"
              rows={analytics.topPages || []}
            />
            <BreakdownCard
              title="Country Distribution"
              rows={analytics.countries || []}
            />
            <BreakdownCard
              title="Device Breakdown"
              rows={analytics.devices || []}
            />
            <BreakdownCard
              title="Browser Statistics"
              rows={analytics.browsers || []}
            />
            <BreakdownCard
              title="Operating Systems"
              rows={analytics.operatingSystems || []}
            />
            <BreakdownCard
              title="Traffic Sources & Referrers"
              rows={analytics.referrers || []}
            />
          </div>
        </>
      )}

      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] px-1">
        <span className="flex items-center gap-1.5">
          <Monitor className="w-3.5 h-3.5" />
          Privacy-friendly analytics — no PII collected
        </span>
        <a
          href="https://vercel.com/docs/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-cyan-400"
        >
          <span>Vercel Docs</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
