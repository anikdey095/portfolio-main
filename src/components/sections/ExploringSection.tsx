import { Compass, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const exploringTopics = [
  {
    title: "Advanced RAG & Hybrid Retrieval",
    detail: "Cross-encoder reranking, BM25 + dense vector fusion, chunking boundary sensitivity, and hallucination reduction.",
    status: "Active Building",
  },
  {
    title: "Agentic AI & Cognitive Workflows",
    detail: "ReAct loops, autonomous reflection, multi-step tool verification, and agent state machines.",
    status: "Active Learning",
  },
  {
    title: "Unstructured Road Perception",
    detail: "Monocular hazard detection and obstacle tracking for non-lane South Asian driving conditions.",
    status: "Research Agenda",
  },
  {
    title: "Multimodal Deep Learning",
    detail: "Vision-language joint embeddings, cross-attention alignment, and visual question answering.",
    status: "Exploring",
  },
  {
    title: "Transformer Encoders & Affective NLP",
    detail: "Comparing fine-tuned compact transformers against BiGRU sequence models and extending emotion classification to Bangla text.",
    status: "Experimenting",
  },
  {
    title: "In-Browser & Serverless AI Serving",
    detail: "Client-side TensorFlow.js object detection, zero-dependency serverless tree evaluators, and containerized FastAPI microservices.",
    status: "Building with",
  },
];

export function ExploringSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
      <div className="space-y-3 mb-12">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0ea5e9]">
          <Compass className="w-4 h-4" />
          <span>Currently Learning</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              What I&apos;m Exploring Next
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mt-1 leading-relaxed">
              Topics I&apos;m actively studying, reading papers on, and prototyping in small experiments as an aspiring AI/ML engineer.
            </p>
          </div>
          <Link
            href="/playground"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline shrink-0"
          >
            <span>Test Conceptual Simulators in Playground</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exploringTopics.map((topic) => (
          <div
            key={topic.title}
            className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-indigo-500/40 hover:bg-[var(--bg-card-hover)] transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {topic.status}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400/70 group-hover:text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-indigo-300 transition-colors">
                {topic.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {topic.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
