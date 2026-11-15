import { ResearchCard } from "@/types/portfolio";

export const researchCards: ResearchCard[] = [
  {
    id: "bangladesh-unstructured-roads",
    title: "AI-Based Intelligent Driving Assistance System for Bangladesh’s Unstructured & Uneven Roads",
    tagline:
      "Perception architectures suited to non-lane traffic, pavement hazards, and mixed vehicles in South Asian driving environments.",
    status: "Exploring",
    domain: "Computer Vision & Intelligent Transportation Systems",
    targetOutcome: "Undergraduate Thesis & Prospective Graduate Research Proposal",
    problem:
      "Standard autonomous vehicle perception datasets (e.g. KITTI, Waymo, nuScenes) presume clearly delineated road lanes, uniform vehicle geometry, and orderly pedestrian crossings. In Bangladesh, roads are largely non-lane-based, dominated by heterogeneous non-motorized and three-wheeled vehicles (rickshaws, CNG auto-rickshaws), unpredictable pedestrian crossings, and severe surface degradation (potholes, unpaved shoulders).",
    researchQuestion:
      "How can a lightweight monocular computer vision architecture jointly perceive unstructured multi-class obstacles and segment road-surface hazards under challenging visual conditions (monsoon rain glare, dust, low-light illumination) on edge compute budgets?",
    whyItMatters:
      "Road traffic injuries are a major public-safety challenge in South Asia. Affordable, aftermarket dashcam-based assistance systems could provide proactive collision and pothole warnings without expensive sensor suites.",
    existingApproaches:
      "Commercial systems rely heavily on lane-departure warning heuristics and LiDAR point clouds. Existing road anomaly studies typically isolate pothole detection on static frames or depend on sensor rigs tailored to structured Western roadways.",
    researchGap:
      "Scarcity of open-access Bangladeshi multi-hazard driving datasets, limited joint perception models that operate without lane priors, and strong domain shifts across local vehicle classes and weather.",
    proposedDirection:
      "A dual-task lightweight convolutional architecture sharing a visual backbone: one head for localized object detection and tracking (rickshaws, auto-rickshaws, buses, pedestrians) and a second head for drivable-area and pothole segmentation, paired with monocular proximity heuristics.",
    experiments:
      "Currently in conceptual formulation and literature review stage; planned empirical work will benchmark detection mAP, segmentation IoU, and edge inference latency once a localized dashcam video benchmark is collected and annotated.",
    currentResults:
      "Formalized the problem definition, target perception taxonomy, and architectural outline. No custom dataset collection, model training, or empirical field experiments have been conducted yet.",
    limitations:
      "Strictly a research direction and proposal outline at this stage; requires curated, annotated field video across varied Bangladeshi traffic and weather conditions before empirical validation.",
    futureWork:
      "Develop as an undergraduate thesis and prospective Master's research topic: curate and annotate local road footage, benchmark YOLO-family detectors on local vehicle classes, and test quantized edge deployment.",
    tags: [
      "Computer Vision",
      "Unstructured Roads",
      "Edge AI",
      "Object Detection",
      "ADAS",
      "Applied Research",
    ],
    statusNote: "Research Direction & Proposal Formulation (No empirical results claimed yet)",
  },
  {
    id: "affective-nlp-sequence-modeling",
    title: "Comparative Sequence Modeling for Multi-Class Emotion Recognition in Text",
    tagline:
      "Evaluating recurrent gating and bidirectional context across SimpleRNN, LSTM, GRU, and BiGRU on six-class affective text.",
    status: "Experimenting",
    domain: "Deep Learning & Natural Language Processing",
    targetOutcome: "Deployed Inference System (Moodline) & Future Transformer / Low-Resource Extension",
    problem:
      "Coarse binary sentiment analysis (positive vs negative) obscures distinct emotional states such as sadness, fear, and anger that carry very different meanings in user feedback, mental-health triage, and conversational agents.",
    researchQuestion:
      "How strongly do gated recurrent units and bidirectional context improve six-class emotion discrimination on short text sequences, and where do fixed-vocabulary recurrent models break down compared to contextual transformers?",
    whyItMatters:
      "Understanding the accuracy-latency-parameter trade-offs between lightweight recurrent models and larger pretrained transformers helps engineers deploy responsive NLP systems on constrained cloud or edge hardware.",
    existingApproaches:
      "Bag-of-words linear baselines miss word order and negation, while large transformer encoders add higher memory and inference latency footprints in CPU-only containers.",
    researchGap:
      "Comparing recurrent variants under identical preprocessing and deployment constraints while extending affective NLP evaluations to code-mixed and Bangla text.",
    proposedDirection:
      "Benchmarked four recurrent architectures (SimpleRNN, LSTM, GRU, BiGRU) with 300-dimensional embeddings and SpatialDropout(0.5) on the Hugging Face dair-ai/emotion dataset, deploying the best model behind a FastAPI + Docker service.",
    experiments:
      "Trained all four sequence models under a 50-token padded pipeline (~15,000-word vocabulary) in sentiment_analysis.ipynb and verified end-to-end API behavior through an automated 5-test suite in Moodline.",
    currentResults:
      "Observed progressive gains from SimpleRNN (~78.4%, ~1.3M params) to LSTM (~86.2%, ~1.6M params), GRU (~87.8%, ~1.5M params), and BiGRU (~90.1%, ~2.1M params), with BiGRU served live at moodline-sentiment.onrender.com.",
    limitations:
      "Evaluations currently report aggregate test accuracy on a single English benchmark with a 50-token window; per-class confusion breakdowns and cross-domain or Bangla generalization have not yet been benchmarked.",
    futureWork:
      "Compare BiGRU directly against fine-tuned compact transformers (e.g. DistilBERT), add per-class F1 and calibration metrics, and extend experiments to Bangla emotion datasets.",
    tags: [
      "NLP",
      "Deep Learning",
      "BiGRU",
      "Sequence Modeling",
      "FastAPI",
      "Affective Computing",
    ],
    statusNote: "Implemented & Deployed in Moodline; Transformer Comparison Planned",
  },
  {
    id: "grounded-rag-architectures",
    title: "Grounded Multi-Document Retrieval-Augmented Generation & Hybrid Reranking",
    tagline:
      "Exploring chunking sensitivity, hybrid lexical-dense search, and cross-encoder reranking beyond single-stage FAISS baselines.",
    status: "Exploring",
    domain: "Generative AI & Information Retrieval",
    targetOutcome: "Working Multi-PDF RAG Baseline (DocMind) & Two-Stage Retrieval Study",
    problem:
      "Single-stage dense vector retrieval can return top-k chunks that are topically adjacent yet miss exact technical terms or split key facts across chunk boundaries, degrading LLM answer faithfulness.",
    researchQuestion:
      "How do chunking boundaries, hybrid sparse-dense retrieval (BM25 + dense embeddings), and cross-encoder reranking affect retrieval precision and answer grounding compared to a single-stage FAISS baseline?",
    whyItMatters:
      "Students, researchers, and engineers querying dense multi-PDF technical or academic corpora need verifiable, source-grounded answers rather than plausible-sounding hallucinations.",
    existingApproaches:
      "Standard LangChain/FAISS pipelines split text into fixed-size character chunks (e.g. 1,000 characters with 200 overlap) and retrieve via cosine similarity alone without reranking or citation verification.",
    researchGap:
      "Evaluating exact-term recall and multi-document attribution across lightweight local embedding models (all-MiniLM-L6-v2) paired with small open-weights LLMs (Llama-3.2-3B-Instruct).",
    proposedDirection:
      "Built the baseline pipeline in DocMind (PyPDF + CharacterTextSplitter 1000/200 + all-MiniLM-L6-v2 + FAISS + ConversationalRetrievalChain with Llama 3.2 / GPT-3.5) and actively exploring two-stage hybrid retrieval (BM25 + dense Reciprocal Rank Fusion) with cross-encoder reranking and page-level source citations.",
    experiments:
      "Implemented and manually tested multi-PDF ingestion, conversation buffer memory, and dual Hugging Face / OpenAI LLM switching in DocMind; quantitative RAG evaluation (faithfulness and context recall benchmarks) is planned next.",
    currentResults:
      "Working Streamlit application supporting multi-PDF upload, 384D local MiniLM embeddings, FAISS search, and graceful error handling for scanned PDFs and API limits.",
    limitations:
      "Current implementation uses single-stage dense similarity search without reranking, stores the FAISS index in memory per session, and has not yet been evaluated on a labeled RAG benchmark.",
    futureWork:
      "Add page-level source citations, implement BM25 + dense hybrid retrieval with a cross-encoder reranker, support OCR for scanned PDFs, and benchmark retrieval metrics systematically.",
    tags: [
      "RAG",
      "LLMs",
      "FAISS",
      "LangChain",
      "Embeddings",
      "Information Retrieval",
    ],
    statusNote: "Baseline Implemented in DocMind; Reranking & Evaluation Under Exploration",
  },
];
