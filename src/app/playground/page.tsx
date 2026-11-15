"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmbeddingVisualizer } from "@/components/playground/EmbeddingVisualizer";
import { RagPipelineSim } from "@/components/playground/RagPipelineSim";
import { VisionInspector } from "@/components/playground/VisionInspector";
import { Sparkles, Compass, Database, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"embedding" | "rag" | "vision">("embedding");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        {/* Breadcrumb / Return */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio Overview</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive AI Laboratory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            AI Conceptual Playground
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Interactive visual demonstrations designed to explore and teach the core mechanics of modern intelligent systems: high-dimensional vector spaces, retrieval-augmented generation pipelines, and edge computer vision inference.
          </p>

          <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/15 text-xs text-indigo-200/90 font-mono flex items-center gap-2">
            <span>Notice:</span> These interactive simulators model real algorithmic equations (Cosine Similarity, Non-Max Suppression, Reciprocal Rank Fusion) client-side for conceptual clarity.
          </div>
        </div>

        {/* Simulator Mode Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--border-subtle)] pb-4">
          <button
            onClick={() => setActiveTab("embedding")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all border ${
              activeTab === "embedding"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>1. Vector Embedding Space</span>
          </button>

          <button
            onClick={() => setActiveTab("rag")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all border ${
              activeTab === "rag"
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-md shadow-indigo-500/10"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Database className="w-4 h-4 text-indigo-400" />
            <span>2. Two-Stage RAG Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab("vision")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all border ${
              activeTab === "vision"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>3. Edge Vision & NMS Inspector</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="space-y-8">
          {activeTab === "embedding" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <EmbeddingVisualizer />
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                <h4 className="font-bold text-base text-[var(--text-primary)]">
                  Why Embedding Geometry Matters
                </h4>
                <p>
                  Modern transformer models map complex linguistic tokens and multimodal features into continuous high-dimensional vector spaces (e.g. 768 or 1536 dimensions). In these latent spaces, semantic concepts naturally cluster by mathematical proximity.
                </p>
                <p>
                  This simulator projects a 4-dimensional normalized vector slice onto a 2D plane. By calculating the dot product normalized by vector magnitudes, cosine similarity provides an angle-based metric invariant to token vector magnitude.
                </p>
              </div>
            </div>
          )}

          {activeTab === "rag" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <RagPipelineSim />
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                <h4 className="font-bold text-base text-[var(--text-primary)]">
                  The Trade-Off Between Latency and Faithfulness
                </h4>
                <p>
                  Naive single-stage RAG optimizes strictly for speed: bi-encoders encode documents independently into vectors, making approximate nearest neighbor (ANN) retrieval fast (&lt;20ms). However, bi-encoders miss contextual cross-attention between the query and candidate passage.
                </p>
                <p>
                  By introducing a cross-encoder reranker over the top candidates, the model evaluates joint token interactions. While this adds ~35-50ms of computational latency, it eliminates noisy chunks and significantly curtails hallucination.
                </p>
              </div>
            </div>
          )}

          {activeTab === "vision" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <VisionInspector />
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                <h4 className="font-bold text-base text-[var(--text-primary)]">
                  Engineering Edge Computer Vision in the Browser
                </h4>
                <p>
                  Running object detection in the browser via TensorFlow.js keeps webcam frames completely local on the user&apos;s device without server video uploads, while requiring careful camera stream lifecycle management and responsive frame loops.
                </p>
                <p>
                  In FocusBell AI, a confidence threshold of 0.65 filters COCO-SSD predictions for cell phone detection alongside a 4-second alert cooldown. This interactive inspector lets you explore confidence thresholding alongside Non-Maximum Suppression (NMS) and multi-frame debouncing concepts.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
