import { EngineeringPhilosophyStep } from "@/types/portfolio";

export const philosophySteps: EngineeringPhilosophyStep[] = [
  {
    stepNumber: "01",
    title: "Understand",
    tagline: "Formulate the exact problem and mathematical objective.",
    description:
      "Deeply dissect the domain challenge before writing any code. Identify whether the solution truly requires a neural network or if a principled heuristic or tabular model is superior. Establish clear baseline criteria.",
    engineeringAction: "Deconstruct requirements, audit raw data distributions, and specify success metrics.",
    artifact: "Problem Formulation & Metric Definition Document",
  },
  {
    stepNumber: "02",
    title: "Research",
    tagline: "Examine established literature, benchmarks, and domain constraints.",
    description:
      "Review empirical papers, existing open-source implementations, and prior failure modes. Avoid reinventing well-solved architectures, but critically scrutinize assumptions (e.g. does a Western ADAS dataset fit Bangladeshi roads?).",
    engineeringAction: "Survey relevant literature, identify algorithmic trade-offs, and design validation splits.",
    artifact: "Prior Art Audit & Experimental Protocol",
  },
  {
    stepNumber: "03",
    title: "Build",
    tagline: "Implement modular, testable, and strictly typed pipelines.",
    description:
      "Construct clean, reproducible data loaders, preprocessing pipelines, and model architectures. Enforce type safety, decouple data transformations from modeling logic, and write deterministic training scripts.",
    engineeringAction: "Code end-to-end data loaders, network backbones, and loss functions with strict typing.",
    artifact: "Modular Codebase & Version-Controlled Pipelines",
  },
  {
    stepNumber: "04",
    title: "Evaluate",
    tagline: "Stress-test for distribution shifts, leakage, and edge cases.",
    description:
      "Never trust a single metric. Inspect confusion matrices, residual error distributions, and time-based holdout splits. Actively look for data leakage, overparameterization, and failure modes across edge scenarios.",
    engineeringAction: "Compute macro F1, ROC-AUC, train-vs-test generalization gaps, and error breakdowns.",
    artifact: "Empirical Validation Matrix & Error Analysis",
  },
  {
    stepNumber: "05",
    title: "Deploy",
    tagline: "Optimize for runtime latency, quantization, and edge constraints.",
    description:
      "Bridge model weights into production environments. Apply dynamic quantization (INT8), compile graph models (ONNX, TF.js WebGL), and build fast asynchronous serving endpoints with input validation.",
    engineeringAction: "Quantize weights, benchmark frame latency, and deploy containerized APIs or edge workers.",
    artifact: "Optimized Inference Artifact & Low-Latency API",
  },
  {
    stepNumber: "06",
    title: "Iterate",
    tagline: "Analyze real-world feedback and refine the cognitive boundary.",
    description:
      "Observe failure cases in actual usage. Continuous improvement comes from targeted data augmentation, active learning on false positives, and disciplined architectural refinements rather than blind hyperparameter sweeps.",
    engineeringAction: "Log out-of-distribution inputs, refine training boundaries, and close the loop.",
    artifact: "Active Learning Loop & Iterative Version Changelog",
  },
];
