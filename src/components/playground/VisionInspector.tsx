"use client";

import { useState } from "react";
import { Eye, Sliders, AlertCircle, ShieldCheck, Cpu, Play } from "lucide-react";

interface DetectedBox {
  id: string;
  label: string;
  rawConfidence: number;
  x: number; // percentage
  y: number;
  width: number;
  height: number;
  isDistractionTarget?: boolean;
}

const mockCandidates: DetectedBox[] = [
  {
    id: "phone-primary",
    label: "Cell Phone",
    rawConfidence: 0.88,
    x: 64,
    y: 48,
    width: 20,
    height: 32,
    isDistractionTarget: true,
  },
  {
    id: "phone-overlap-nms",
    label: "Cell Phone (Candidate 2)",
    rawConfidence: 0.74,
    x: 62,
    y: 46,
    width: 22,
    height: 34,
    isDistractionTarget: true,
  },
  {
    id: "laptop",
    label: "Laptop Keyboard",
    rawConfidence: 0.95,
    x: 18,
    y: 52,
    width: 42,
    height: 38,
  },
  {
    id: "mug",
    label: "Coffee Cup",
    rawConfidence: 0.62,
    x: 10,
    y: 24,
    width: 14,
    height: 22,
  },
  {
    id: "faint-wallet",
    label: "Dark Notebook / Wallet",
    rawConfidence: 0.42,
    x: 42,
    y: 22,
    width: 16,
    height: 20,
  },
];

export function VisionInspector() {
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.65);
  const [nmsSuppression, setNmsSuppression] = useState<boolean>(true);
  const [consecutiveFrames, setConsecutiveFrames] = useState<number>(4);

  // Filter boxes according to threshold and NMS
  const activeBoxes = mockCandidates.filter((box) => {
    // If NMS is enabled, suppress the secondary overlapping phone candidate
    if (nmsSuppression && box.id === "phone-overlap-nms") return false;
    return box.rawConfidence >= confidenceThreshold;
  });

  const phoneDetected = activeBoxes.some((b) => b.isDistractionTarget);
  const alertTriggered = phoneDetected && consecutiveFrames >= 4;

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
            <Eye className="w-4 h-4" />
            <span>Interactive Simulator 03</span>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">
            Edge Perception & NMS Inspector (FocusBell AI & Edge CV)
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Interactive visual simulation of browser object detection (TensorFlow.js / COCO-SSD), confidence thresholding, NMS, and temporal debouncing.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Browser Inference Simulator
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Visualized Camera Viewport */}
        <div className="lg:col-span-8 p-6 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] bg-[var(--bg-primary)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] mb-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Simulated Webcam Feed (640x480 Browser Stream)
            </span>
            <span className="text-cyan-400">FPS: ~28.4</span>
          </div>

          {/* Canvas area representing desk scene */}
          <div className="relative w-full aspect-[4/3] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden shadow-inner tech-grid flex items-center justify-center">
            {/* Visual background silhouettes */}
            <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
              <div className="text-center space-y-1">
                <Cpu className="w-12 h-12 mx-auto text-cyan-400" />
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Desk Workspace Scene
                </span>
              </div>
            </div>

            {/* Render Candidate Bounding Boxes */}
            {mockCandidates.map((box) => {
              const isPassingConf = box.rawConfidence >= confidenceThreshold;
              const isSuppressedByNMS = nmsSuppression && box.id === "phone-overlap-nms";
              const isVisible = isPassingConf && !isSuppressedByNMS;

              return (
                <div
                  key={box.id}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                  className={`absolute rounded transition-all duration-150 flex flex-col justify-between p-1.5 ${
                    isVisible
                      ? box.isDistractionTarget
                        ? "border-2 border-red-500 bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        : "border-2 border-cyan-400 bg-cyan-500/10"
                      : "border border-dashed border-slate-700/50 opacity-20 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[9px] font-mono font-bold px-1 rounded truncate ${
                        isVisible
                          ? box.isDistractionTarget
                            ? "bg-red-950 text-red-300 border border-red-500/40"
                            : "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                          : "text-slate-500"
                      }`}
                    >
                      {box.label}
                    </span>
                    <span
                      className={`text-[9px] font-mono ${
                        isVisible
                          ? box.isDistractionTarget
                            ? "text-red-400 font-bold"
                            : "text-cyan-400 font-bold"
                          : "text-slate-600"
                      }`}
                    >
                      {(box.rawConfidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  {isSuppressedByNMS && (
                    <span className="text-[8px] font-mono text-amber-400 bg-black/60 px-1 rounded">
                      [NMS Suppressed]
                    </span>
                  )}
                </div>
              );
            })}

            {/* Alert Banner inside Viewport if triggered */}
            {alertTriggered && (
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-red-950/90 border border-red-500 text-red-200 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg animate-bounce">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>Audio Alert Active: Phone Detected!</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] mt-2">
            <span>Detections Visible: {activeBoxes.length} objects</span>
            <span>Target Class: Cell Phone (Class #67)</span>
          </div>
        </div>

        {/* Right Controls Panel */}
        <div className="lg:col-span-4 p-6 space-y-6 flex flex-col justify-between bg-[var(--bg-card)]">
          <div className="space-y-5">
            <h4 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              Inference Hyperparameters
            </h4>

            {/* Confidence Threshold Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Confidence Threshold:</span>
                <span className="text-cyan-400 font-bold">
                  {(confidenceThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[10px] text-[var(--text-muted)]">
                {confidenceThreshold < 0.5
                  ? "High sensitivity (may capture dark wallet / false positives)."
                  : confidenceThreshold > 0.8
                  ? "Strict threshold (may miss phone under dim lighting)."
                  : "FocusBell AI threshold (0.65) for cell phone detection."}
              </p>
            </div>

            {/* Non-Maximum Suppression (NMS) Toggle */}
            <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-primary)] font-medium">
                  NMS IoU Overlap Suppression
                </span>
                <button
                  onClick={() => setNmsSuppression(!nmsSuppression)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                    nmsSuppression
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {nmsSuppression ? "ON (IoU > 0.45)" : "OFF"}
                </button>
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">
                Suppresses redundant secondary bounding boxes overlapping the same physical phone.
              </p>
            </div>

            {/* Temporal Debounce Frames */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Temporal Debounce Frames:</span>
                <span className="text-emerald-400 font-bold">{consecutiveFrames} frames</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={consecutiveFrames}
                onChange={(e) => setConsecutiveFrames(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <p className="text-[10px] text-[var(--text-muted)]">
                Conceptual debounce: requiring 4 consecutive positive frames helps filter false audio alerts from transient hand gestures.
              </p>
            </div>
          </div>

          {/* System State Diagnosis */}
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
              State Machine Status:
            </div>
            <div className="flex items-center gap-2">
              {alertTriggered ? (
                <div className="text-xs font-mono text-red-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  STATE_ALERT: Phone Detected in Desk Boundary
                </div>
              ) : phoneDetected ? (
                <div className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  STATE_DEBOUNCING: Verifying Consecutive Frames...
                </div>
              ) : (
                <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  STATE_FOCUS: Workspace Clear, Pomodoro Running
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
