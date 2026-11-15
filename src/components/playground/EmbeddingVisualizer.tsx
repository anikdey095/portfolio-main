"use client";

import { useState, useMemo } from "react";
import { Search, Compass, Info, Check } from "lucide-react";

interface EmbeddingPoint {
  id: string;
  name: string;
  category: "Deep Learning" | "Computer Vision" | "RAG & LLMs" | "Classical ML";
  x: number; // 0 to 100
  y: number; // 0 to 100
  vec: number[]; // 4D conceptual vector
  description: string;
}

const concepts: EmbeddingPoint[] = [
  {
    id: "transformer",
    name: "Transformer",
    category: "Deep Learning",
    x: 68,
    y: 35,
    vec: [0.88, 0.45, 0.82, 0.91],
    description: "Multi-head self-attention architecture processing sequences in parallel.",
  },
  {
    id: "attention",
    name: "Self-Attention",
    category: "Deep Learning",
    x: 74,
    y: 30,
    vec: [0.92, 0.40, 0.85, 0.89],
    description: "Query, Key, Value tensor matrix calculating contextual token importance weights.",
  },
  {
    id: "llm",
    name: "Large Language Model",
    category: "RAG & LLMs",
    x: 82,
    y: 42,
    vec: [0.91, 0.32, 0.94, 0.86],
    description: "Auto-regressive generative neural network trained on vast token sequences.",
  },
  {
    id: "rag",
    name: "RAG (Retrieval-Augmented)",
    category: "RAG & LLMs",
    x: 78,
    y: 58,
    vec: [0.75, 0.31, 0.96, 0.72],
    description: "Injects retrieved external knowledge chunks into LLM inference context.",
  },
  {
    id: "vector-db",
    name: "Vector Database (HNSW)",
    category: "RAG & LLMs",
    x: 64,
    y: 65,
    vec: [0.62, 0.28, 0.92, 0.65],
    description: "Specialized database indexing dense embedding vectors for approximate nearest neighbor search.",
  },
  {
    id: "embeddings",
    name: "Dense Embeddings",
    category: "RAG & LLMs",
    x: 60,
    y: 50,
    vec: [0.71, 0.36, 0.89, 0.78],
    description: "Continuous mathematical vector spaces mapping semantic meaning to coordinates.",
  },
  {
    id: "cnn",
    name: "CNN (ConvNet)",
    category: "Computer Vision",
    x: 25,
    y: 32,
    vec: [0.82, 0.91, 0.32, 0.41],
    description: "Spatial feature extraction using sliding kernel weights and receptive fields.",
  },
  {
    id: "resnet",
    name: "Residual Network (ResNet)",
    category: "Computer Vision",
    x: 32,
    y: 28,
    vec: [0.85, 0.88, 0.38, 0.45],
    description: "Skip-connections enabling deep gradient backpropagation without vanishing gradients.",
  },
  {
    id: "yolo",
    name: "YOLO Object Detection",
    category: "Computer Vision",
    x: 22,
    y: 48,
    vec: [0.78, 0.94, 0.28, 0.52],
    description: "Single-stage bounding-box regression and spatial anchor-free detection.",
  },
  {
    id: "bigru",
    name: "BiGRU Sequence Model",
    category: "Deep Learning",
    x: 56,
    y: 38,
    vec: [0.84, 0.52, 0.76, 0.80],
    description: "Bidirectional gated recurrent network capturing forward and backward sequence context (used in Moodline).",
  },
  {
    id: "faiss",
    name: "FAISS Vector Index",
    category: "RAG & LLMs",
    x: 68,
    y: 72,
    vec: [0.65, 0.29, 0.94, 0.68],
    description: "In-memory similarity search index storing dense sentence embeddings (used in DocMind).",
  },
  {
    id: "random-forest",
    name: "Random Forest",
    category: "Classical ML",
    x: 22,
    y: 84,
    vec: [0.38, 0.51, 0.18, 0.81],
    description: "Bagging ensemble averaging decorrelated decision trees to curtail variance.",
  },
  {
    id: "backprop",
    name: "Backpropagation",
    category: "Deep Learning",
    x: 48,
    y: 22,
    vec: [0.94, 0.72, 0.52, 0.70],
    description: "Chain rule of calculus propagating partial loss derivatives back through weights.",
  },
  {
    id: "gradient-descent",
    name: "AdamW Optimizer",
    category: "Deep Learning",
    x: 52,
    y: 35,
    vec: [0.89, 0.68, 0.55, 0.74],
    description: "Adaptive first and second momentum optimization with decoupled weight decay.",
  },
];

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(sum);
}

export function EmbeddingVisualizer() {
  const [selectedId, setSelectedId] = useState<string>("transformer");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [metricType, setMetricType] = useState<"cosine" | "euclidean">("cosine");

  const selectedConcept = concepts.find((c) => c.id === selectedId) || concepts[0];

  // Calculate nearest neighbors
  const neighbors = useMemo(() => {
    return concepts
      .filter((c) => c.id !== selectedConcept.id)
      .map((c) => {
        const cosSim = cosineSimilarity(selectedConcept.vec, c.vec);
        const eucDist = euclideanDistance(selectedConcept.vec, c.vec);
        return {
          ...c,
          cosine: cosSim,
          euclidean: eucDist,
          score: metricType === "cosine" ? cosSim : 1 / (1 + eucDist),
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [selectedConcept, metricType]);

  const top3Neighbors = neighbors.slice(0, 3);

  const filteredConcepts = useMemo(() => {
    if (!searchQuery.trim()) return concepts;
    return concepts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden shadow-xl">
      {/* Top Banner */}
      <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
            <Compass className="w-4 h-4" />
            <span>Interactive Simulator 01</span>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">
            Semantic Vector Embedding Space
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            2D t-SNE / UMAP conceptual projection. Select any concept to compute real-time Cosine Similarity & K-Nearest Neighbors.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setMetricType("cosine")}
            className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors border ${
              metricType === "cosine"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Cosine Similarity (cos θ)
          </button>
          <button
            onClick={() => setMetricType("euclidean")}
            className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors border ${
              metricType === "euclidean"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Euclidean (L2 Norm)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left 2D Coordinate Projection Map */}
        <div className="lg:col-span-8 p-6 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] relative min-h-[420px] bg-[var(--bg-primary)]/80 tech-grid flex flex-col justify-between">
          {/* Coordinates Header */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] z-10">
            <span>Latent Dim X₁ →</span>
            <span>Simulation: Normalized 4D Projections</span>
          </div>

          {/* Interactive Scatter Canvas */}
          <div className="relative w-full h-[320px] my-auto">
            {/* Connecting lines from selected node to top-3 neighbors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {top3Neighbors.map((n, i) => (
                <line
                  key={n.id}
                  x1={`${selectedConcept.x}%`}
                  y1={`${selectedConcept.y}%`}
                  x2={`${n.x}%`}
                  y2={`${n.y}%`}
                  stroke="rgba(6, 182, 212, 0.4)"
                  strokeWidth={2.5 - i * 0.7}
                  strokeDasharray={i === 0 ? "none" : "4 4"}
                />
              ))}
            </svg>

            {/* Render Concept Points */}
            {filteredConcepts.map((item) => {
              const isSelected = item.id === selectedId;
              const isNeighbor = top3Neighbors.some((n) => n.id === item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform z-10 ${
                    isSelected ? "scale-125 z-30" : isNeighbor ? "scale-110 z-20" : "hover:scale-110"
                  }`}
                  aria-label={`Select concept ${item.name}`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      isSelected
                        ? "bg-cyan-400 border-white shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                        : isNeighbor
                        ? "bg-emerald-400 border-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        : "bg-[var(--border-active)] border-[var(--border-subtle)] group-hover:border-cyan-400"
                    }`}
                  />
                  <span
                    className={`absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono px-1.5 py-0.5 rounded transition-all pointer-events-none ${
                      isSelected
                        ? "bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold shadow-md"
                        : isNeighbor
                        ? "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                        : "bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] z-10">
            <span>↑ Latent Dim X₂</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Active Query
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Top-3 K-NN
              </span>
            </div>
          </div>
        </div>

        {/* Right Info & Vector Distance Math Panel */}
        <div className="lg:col-span-4 p-6 flex flex-col justify-between space-y-6 bg-[var(--bg-card)]">
          {/* Active Selection Details */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {selectedConcept.category}
              </span>
              <h4 className="text-xl font-bold text-[var(--text-primary)] mt-1.5">
                {selectedConcept.name}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                {selectedConcept.description}
              </p>
            </div>

            {/* Mathematical Vector Tensor Preview */}
            <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                Projected Embedding Vector (4D Slice):
              </div>
              <div className="font-mono text-xs text-cyan-400 break-all">
                [{selectedConcept.vec.map((v) => v.toFixed(3)).join(", ")}]
              </div>
            </div>

            {/* Top-K Nearest Neighbors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-primary)] font-semibold">
                  Top K-Nearest Neighbors
                </span>
                <span className="text-cyan-400 text-[10px]">
                  {metricType === "cosine" ? "Cosine Similarity (0 - 1)" : "Inverse L2 Distance"}
                </span>
              </div>

              <div className="space-y-2">
                {top3Neighbors.map((n, idx) => (
                  <div
                    key={n.id}
                    onClick={() => setSelectedId(n.id)}
                    className="p-2.5 rounded-lg border border-[var(--border-subtle)] hover:border-emerald-500/40 bg-[var(--bg-secondary)] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--text-primary)]">
                        {idx + 1}. {n.name}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {metricType === "cosine"
                          ? n.cosine.toFixed(4)
                          : n.euclidean.toFixed(4)}
                      </span>
                    </div>

                    {/* Similarity Bar */}
                    <div className="w-full bg-[var(--bg-primary)] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                        style={{ width: `${Math.max(10, n.score * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mathematical Rationale Footer */}
          <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] space-y-1">
            <div className="flex items-center gap-1 text-cyan-400 font-mono">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Cosine Formula:</span>
            </div>
            <p className="font-mono text-[10px]">
              sim(u, v) = (u · v) / (||u||₂ × ||v||₂)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
