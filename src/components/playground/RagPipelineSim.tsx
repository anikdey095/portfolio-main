"use client";

import { useState } from "react";
import { Database, Filter, Layers, Cpu, CheckCircle, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

export function RagPipelineSim() {
  const [query, setQuery] = useState<string>("How does DocMind retrieve context across multiple uploaded PDFs?");
  const [chunkSize, setChunkSize] = useState<number>(256);
  const [topK, setTopK] = useState<number>(4);
  const [rerankerEnabled, setRerankerEnabled] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Simulated metrics derived from parameter configurations
  const latency = 18 + (chunkSize > 512 ? 22 : 12) + topK * 4 + (rerankerEnabled ? 38 : 0);
  const contextRelevance = Math.min(
    96,
    Math.round(
      (rerankerEnabled ? 88 : 62) + (chunkSize === 256 ? 6 : chunkSize === 512 ? 4 : -8) + (topK <= 4 ? 4 : -6)
    )
  );
  const hallucinationRisk = Math.max(
    4,
    Math.round(100 - contextRelevance - (rerankerEnabled ? 12 : 0))
  );

  const sampleQueries = [
    "How does DocMind retrieve context across multiple uploaded PDFs?",
    "How does CropPulse AI guarantee serverless uptime on Vercel?",
    "Why does standard lane detection fail on Bangladesh roadways?",
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-indigo-400">
            <Database className="w-4 h-4" />
            <span>Interactive Simulator 02</span>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">
            Two-Stage RAG Pipeline Simulator
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Step-by-step architectural breakdown: Chunking → Dense Retrieval → Cross-Encoder Reranking → Grounded Synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Conceptual Mechanics Lab
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Step 1: Query Input */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[var(--text-secondary)] flex items-center justify-between">
            <span>Stage 1: User Query / Prompt</span>
            <span className="text-[10px] text-[var(--text-muted)]">Select or type custom query</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] focus:border-indigo-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {sampleQueries.map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-indigo-300 transition-colors truncate max-w-xs"
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 & 3: Controls for Chunking, Retrieval, and Reranking */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[var(--border-subtle)]">
          {/* Chunking Size Slider */}
          <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-primary)] font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Chunk Size:
              </span>
              <span className="text-cyan-400 font-bold">{chunkSize} tokens</span>
            </div>
            <input
              type="range"
              min="128"
              max="1024"
              step="128"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[10px] text-[var(--text-muted)]">
              {chunkSize <= 256
                ? "Fine-grained semantic precision, minimal dilution."
                : chunkSize >= 768
                ? "Broad contextual window, higher risk of passage dilution."
                : "Balanced paragraph-scale representation."}
            </p>
          </div>

          {/* Top-K Retrieval Candidates */}
          <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-primary)] font-medium flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Dense Top-K:
              </span>
              <span className="text-emerald-400 font-bold">{topK} chunks</span>
            </div>
            <input
              type="range"
              min="2"
              max="12"
              step="2"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[10px] text-[var(--text-muted)]">
              Candidate passages fetched from vector index (HNSW cosine search).
            </p>
          </div>

          {/* Cross-Encoder Reranker Toggle */}
          <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-primary)] font-medium flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-400" />
                Cross-Encoder Reranker
              </span>
              <button
                onClick={() => setRerankerEnabled(!rerankerEnabled)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  rerankerEnabled
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {rerankerEnabled ? "ENABLED" : "DISABLED"}
              </button>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              {rerankerEnabled
                ? "Full joint attention filtering out irrelevant chunks (+38ms latency for ~30% higher precision)."
                : "Naive single-stage RAG: raw vector candidates directly injected into context."}
            </p>
          </div>
        </div>

        {/* Live Simulation Performance Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
              Simulated Retrieval Latency:
            </span>
            <div className="text-lg font-mono font-bold text-cyan-400">
              ~{latency} ms
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
              Context Relevance Score:
            </span>
            <div className="text-lg font-mono font-bold text-emerald-400">
              {contextRelevance}%
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
              Estimated Hallucination Risk:
            </span>
            <div
              className={`text-lg font-mono font-bold ${
                hallucinationRisk <= 15 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {hallucinationRisk}% ({hallucinationRisk <= 15 ? "Low Risk" : "Moderate Risk"})
            </div>
          </div>
        </div>

        {/* Pipeline Output Inspection */}
        <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-[11px] text-[var(--text-muted)]">
            <span>Simulated Synthesis Output</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Grounded Response Generated
            </span>
          </div>

          <div className="text-[var(--text-secondary)] leading-relaxed space-y-2">
            <p>
              <strong className="text-[var(--text-primary)]">System Context Citation [Chunk 01 - Verified]:</strong>{" "}
              DocMind extracts PDF text via PyPDF, splits it with CharacterTextSplitter (1,000 characters, 200 overlap), and indexes 384D all-MiniLM-L6-v2 embeddings in FAISS before prompting Llama 3.2 or GPT-3.5.
            </p>
            {rerankerEnabled ? (
              <p className="text-indigo-300">
                <strong className="text-indigo-400">[Cross-Encoder Filtered]:</strong> Removed 2 irrelevant tabular baseline noise chunks before prompt assembly.
              </p>
            ) : (
              <p className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>[Warning: Naive RAG]: Unfiltered candidate chunks may introduce tangential prompt noise.</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
