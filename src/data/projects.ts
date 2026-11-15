import { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    "id": "crop-recommendation",
    "slug": "crop-recommendation",
    "title": "CropPulse AI: Precision Crop Recommendation",
    "tagline": "Random Forest crop recommender for 22 crops with a Flask API, serverless fallback engine, and an interactive web app deployed on Vercel.",
    "summary": "An end-to-end machine learning application that recommends the most suitable crop from soil nutrients (N, P, K), temperature, humidity, pH, and rainfall. Three classifiers were benchmarked on 2,200 samples across 22 crop classes; the production Random Forest reaches 99.55% test accuracy and is served through a Flask API on Vercel with a zero-dependency JSON decision-tree fallback, nutrient gap analysis, and fertilizer guidance.",
    "category": "Machine Learning",
    "domain": "Precision Agriculture & Applied ML",
    "status": "Completed",
    "featured": true,
    "featuredOrder": 1,
    "stack": [
      "Python",
      "Scikit-learn",
      "Random Forest",
      "Pandas",
      "Flask",
      "JavaScript",
      "Vercel"
    ],
    "githubUrl": "https://github.com/anikdey095/crop-recommendation",
    "demoUrl": "https://crop-recommendation-zeta.vercel.app",
    "metrics": [
      {
        "label": "Test Accuracy",
        "value": "99.55%",
        "subtext": "Random Forest (80 trees) on a 20% stratified hold-out (440 samples)",
        "isTrainMetric": false
      },
      {
        "label": "5-Fold Stratified CV",
        "value": "99.59%",
        "subtext": "Mean cross-validation accuracy (± 0.3%)"
      },
      {
        "label": "Crop Classes",
        "value": "22",
        "subtext": "Cereals, pulses, fruits, and plantation/cash crops"
      },
      {
        "label": "Inference Latency",
        "value": "0.68 ms",
        "subtext": "Reported per-prediction latency of the Random Forest"
      }
    ],
    "highlights": [
      "Benchmarked Random Forest (99.55%), Decision Tree (97.95%), and Logistic Regression (95.00%) on identical stratified splits.",
      "Dual-engine inference: scikit-learn/joblib model plus a zero-dependency JSON decision-tree evaluator for serverless reliability.",
      "Interactive UI with agro-ecological presets, Open-Meteo weather autofill, nutrient gap analysis, and fertilizer schedules.",
      "REST API (/api/predict, /api/crops, /api/model-info, /api/health) covered by a 10-test automated suite."
    ],
    "problem": "Smallholder farmers often lack accessible, data-backed tools to pick the right crop for their soil NPK balance and local weather conditions.",
    "approach": "Benchmarked Logistic Regression, Decision Tree, and Random Forest across 2,200 labeled samples (22 classes); deployed the 99.55%-accurate Random Forest behind a Flask API with Open-Meteo weather autofill and nutrient gap feedback.",
    "challenges": "Heavy scikit-learn dependencies can trigger cold-start timeouts on serverless deployments, so I implemented a zero-dependency JSON decision-tree fallback engine for reliable inference on Vercel.",
    "keyArchitecture": "Soil & Climate Inputs (N, P, K, Temp, Humidity, pH, Rainfall) → Flask API on Vercel → Random Forest (joblib) or JSON Tree Fallback → Crop + Confidence + Alternates → Suitability & Fertilizer Advisory UI.",
    "hasDetailedCaseStudy": true
  },
  {
    "id": "moodline-sentiment",
    "slug": "moodline-sentiment",
    "title": "Moodline: Deep Learning Emotion Classification",
    "tagline": "BiGRU-based NLP system that classifies text into six emotions, served via an async FastAPI backend and deployed on Render.",
    "summary": "An end-to-end deep learning and NLP application for multi-class emotion classification (joy, sadness, love, anger, fear, surprise). Four sequence architectures — SimpleRNN, LSTM, GRU, and Bidirectional GRU — were trained and compared on the Hugging Face dair-ai/emotion dataset. The best model (BiGRU, ~90.1% test accuracy) is served in real time through a FastAPI backend with an interactive web UI, Docker containerization, and an automated test suite.",
    "category": "Deep Learning",
    "domain": "Natural Language Processing",
    "status": "Completed",
    "featured": true,
    "featuredOrder": 2,
    "stack": [
      "Python",
      "TensorFlow",
      "Keras",
      "BiGRU / LSTM",
      "Hugging Face Datasets",
      "FastAPI",
      "Docker",
      "Render"
    ],
    "githubUrl": "https://github.com/anikdey095/Deep_Learning_Project_Sentiment_analysis",
    "demoUrl": "https://moodline-sentiment.onrender.com/",
    "metrics": [
      {
        "label": "BiGRU Test Accuracy",
        "value": "~90.1%",
        "subtext": "Selected model on the dair-ai/emotion benchmark",
        "isTrainMetric": false
      },
      {
        "label": "Architectures Compared",
        "value": "4",
        "subtext": "SimpleRNN (~78.4%), LSTM (~86.2%), GRU (~87.8%), BiGRU"
      },
      {
        "label": "Emotion Classes",
        "value": "6",
        "subtext": "Joy, Sadness, Love, Anger, Fear, Surprise"
      },
      {
        "label": "Serving",
        "value": "FastAPI",
        "subtext": "Async /predict and /health endpoints with Swagger docs"
      }
    ],
    "highlights": [
      "Compared SimpleRNN, LSTM, GRU, and BiGRU models; selected BiGRU for its bidirectional context.",
      "Text pipeline: cleaning, contraction normalization, tokenization, and padding to 50 tokens with 300-d embeddings.",
      "Async FastAPI service returning the predicted emotion, full probability distribution, and latency.",
      "Dockerfile with a non-root user and health checks, a Render blueprint, and an end-to-end test suite."
    ],
    "problem": "Keyword rules struggle to capture nuanced emotional intent in short text across subtle overlapping classes like sadness, fear, and anger.",
    "approach": "Built a consistent preprocessing pipeline (50-token padding, 300-d embeddings) and trained SimpleRNN, LSTM, GRU, and BiGRU side-by-side on dair-ai/emotion, deploying the best BiGRU (~90.1%) in an async FastAPI + Docker service.",
    "challenges": "Unidirectional RNNs missed context from trailing negation and modifiers, which bidirectional layers solved—paired with Spatial Dropout to curb overfitting on minority classes like love and surprise.",
    "keyArchitecture": "Raw Text → Preprocessing & Tokenization (max len 50) → Embedding (300-d) → BiGRU (128) → Spatial Dropout → BiGRU (64) → Dropout → Softmax (6 emotions) → FastAPI /predict → Web UI.",
    "hasDetailedCaseStudy": true
  },
  {
    "id": "docmind-rag",
    "slug": "docmind-rag",
    "title": "DocMind: Multi-PDF RAG Q&A Chatbot",
    "tagline": "Retrieval-Augmented Generation assistant for chatting with multiple PDFs using LangChain, FAISS, and Llama 3.2 or GPT-3.5.",
    "summary": "A conversational RAG application that lets users upload one or more PDF documents and ask natural-language questions about them. Text is extracted with PyPDF, split into overlapping chunks, embedded with sentence-transformers (all-MiniLM-L6-v2), and indexed in an in-memory FAISS vector store. A LangChain ConversationalRetrievalChain with conversation memory generates grounded answers using either Hugging Face Llama-3.2-3B-Instruct or OpenAI GPT-3.5-Turbo, all inside a Streamlit interface.",
    "category": "Generative AI",
    "domain": "LLMs & Retrieval-Augmented Generation",
    "status": "Completed",
    "featured": true,
    "featuredOrder": 3,
    "stack": [
      "Python",
      "LangChain",
      "FAISS",
      "Sentence-Transformers",
      "Llama 3.2",
      "OpenAI GPT-3.5",
      "Streamlit"
    ],
    "githubUrl": "https://github.com/anikdey095/Chat-with-Multiple-PDFs",
    "metrics": [
      {
        "label": "Embedding Model",
        "value": "MiniLM-L6-v2",
        "subtext": "384-dimensional sentence-transformer embeddings"
      },
      {
        "label": "Vector Store",
        "value": "FAISS",
        "subtext": "In-memory similarity search over document chunks"
      },
      {
        "label": "Chunking",
        "value": "1000 / 200",
        "subtext": "Characters per chunk / overlap"
      },
      {
        "label": "LLM Backends",
        "value": "2",
        "subtext": "Llama-3.2-3B-Instruct (HF) or GPT-3.5-Turbo"
      }
    ],
    "highlights": [
      "Simultaneous multi-PDF ingestion into a single searchable knowledge base.",
      "Dual LLM backend selectable from the sidebar: Hugging Face Inference API or OpenAI.",
      "Conversation memory (ConversationBufferMemory) for coherent follow-up questions.",
      "Graceful handling of scanned/empty PDFs, missing API keys, and OpenAI quota errors."
    ],
    "problem": "Reading and cross-referencing information across multiple dense PDF documents manually is slow, while prompting an LLM directly without context causes hallucinations.",
    "approach": "Extracted text with PyPDF, split documents into overlapping chunks (1000/200 chars), embedded them using all-MiniLM-L6-v2 into a FAISS vector store, and built a LangChain ConversationalRetrievalChain supporting Llama 3.2 and GPT-3.5.",
    "challenges": "Tuned chunk boundaries so multi-paragraph context remained intact during similarity lookup, and added explicit error handling for scanned PDFs with no selectable text layer.",
    "keyArchitecture": "PDF Upload → PyPDF Text Extraction → CharacterTextSplitter (1000/200) → all-MiniLM-L6-v2 Embeddings → FAISS Index → Similarity Retrieval → ConversationalRetrievalChain + Memory → Llama 3.2 / GPT-3.5 → Streamlit Chat UI.",
    "hasDetailedCaseStudy": true
  },
  {
    "id": "focusbell-ai",
    "slug": "focusbell-ai",
    "title": "FocusBell AI: In-Browser Phone Distraction Detector",
    "tagline": "Study focus timer that uses real-time COCO-SSD object detection in TensorFlow.js to catch phone use and reset the session.",
    "summary": "A productivity web app that combines a configurable focus timer with real-time computer vision running entirely in the browser. A pre-trained COCO-SSD model (TensorFlow.js) analyzes webcam frames; when a 'cell phone' is detected with confidence above 0.65 during an active session, the app plays an audio alert, shows a warning state, and resets the timer. Webcam frames are processed locally on the device.",
    "category": "Computer Vision",
    "domain": "Real-time In-Browser Object Detection",
    "status": "Completed",
    "featured": true,
    "featuredOrder": 4,
    "stack": [
      "React",
      "Vite",
      "TensorFlow.js",
      "COCO-SSD",
      "Tailwind CSS",
      "Framer Motion",
      "Vercel"
    ],
    "githubUrl": "https://github.com/anikdey095/mobile-detector",
    "demoUrl": "https://mobile-detector.vercel.app",
    "metrics": [
      {
        "label": "Detection Model",
        "value": "COCO-SSD",
        "subtext": "Pre-trained TensorFlow.js object detector"
      },
      {
        "label": "Target Class",
        "value": "Cell Phone",
        "subtext": "Triggered when confidence > 0.65"
      },
      {
        "label": "Inference",
        "value": "In-Browser",
        "subtext": "Webcam frames processed locally on the device"
      },
      {
        "label": "Alert Cooldown",
        "value": "4 s",
        "subtext": "Prevents repeated alerts from a single event"
      }
    ],
    "highlights": [
      "Continuous frame-by-frame detection with requestAnimationFrame on the webcam stream.",
      "Phone detection triggers an audio alert, a warning UI state, and a timer reset to enforce focus.",
      "Configurable hour/minute/second timer (25-minute default) with pause, resume, and abort controls.",
      "Deployed on Vercel as a lightweight React + Vite single-page app."
    ],
    "problem": "Standard study timers don't prevent unconscious smartphone distractions, while cloud-based webcam tools raise serious privacy concerns.",
    "approach": "Integrated pre-trained COCO-SSD object detection via TensorFlow.js directly inside React so frames never leave the user's browser, alerting and resetting the study timer when a phone is detected (>0.65 confidence).",
    "challenges": "Continuous detection frames caused UI jank and repeated false-trigger sounds, which I fixed using requestAnimationFrame pacing and a 4-second cooldown gate.",
    "keyArchitecture": "Webcam MediaStream → HTML5 Video → COCO-SSD (TensorFlow.js) Detection Loop → 'cell phone' score > 0.65 → Cooldown Gate (4 s) → Audio Alert + Timer Reset.",
    "hasDetailedCaseStudy": true
  },
  {
    "id": "studyhub",
    "slug": "studyhub",
    "title": "StudyHub: Academic Collaboration Platform",
    "tagline": "Full-stack university platform for sharing study materials, course catalogs, careers, and research preprints.",
    "summary": "A full-stack academic collaboration platform that brings study notes, departmental course catalogs, tuition and internship listings, and research preprints into one place. Built with a Next.js 14 (App Router) + TypeScript frontend and a Node.js/Express REST API using Prisma ORM and PostgreSQL, with JWT authentication, file uploads, and an admin hub for managing departments, courses, careers, and papers.",
    "category": "Systems & Web",
    "domain": "Full-Stack Educational Platform",
    "status": "Completed",
    "featured": true,
    "featuredOrder": 5,
    "stack": [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL"
    ],
    "githubUrl": "https://github.com/anikdey095/Studyhub",
    "metrics": [
      {
        "label": "Departments",
        "value": "6",
        "subtext": "CSE, SWE, ENG, EEE, ECO, DS pre-configured"
      },
      {
        "label": "Core Modules",
        "value": "5",
        "subtext": "Notes, Departments, Careers, Research, Profiles"
      },
      {
        "label": "Auth",
        "value": "JWT",
        "subtext": "Sign-up/login with bcrypt hashing and role gateway"
      }
    ],
    "highlights": [
      "Notes repository with full-text search, filtering, sorting, and multi-format uploads (PDF, DOCX, images).",
      "Dynamic course creation: students can register new courses that become instantly discoverable.",
      "Admin hub for departments, courses, job/tuition listings, and research preprints with DOI links.",
      "Security middleware with Helmet, rate limiting, bcrypt, and Multer-based file handling."
    ],
    "problem": "Students across departments often rely on scattered messaging groups for lecture notes, course updates, tuition posts, and research preprints.",
    "approach": "Designed a full-stack university portal with Next.js 14 App Router, Express REST endpoints, JWT auth, Prisma ORM, and PostgreSQL covering 6 departments and 5 integrated academic modules.",
    "challenges": "Coordinating structured file uploads, role-gated admin CRUD, and graceful local testing without a live DB required adding Multer validation, rate limiting, and an in-memory fallback store.",
    "keyArchitecture": "Next.js 14 App Router Client → Axios → Express REST API (/auth, /departments, /notes, /admin, /stats) → Prisma ORM → PostgreSQL (with in-memory fallback store).",
    "hasDetailedCaseStudy": true
  },
  {
    "id": "bangladesh-driving-assistance",
    "slug": "bangladesh-driving-assistance",
    "title": "Intelligent Driving Assistance for Unstructured Roadways",
    "tagline": "Research direction on computer vision for non-lane traffic, potholes, and pedestrian hazards on Bangladeshi roads.",
    "summary": "A research direction exploring computer vision perception suited to South Asian road environments, where lane markings are often absent, non-motorized vehicles (rickshaws) are common, pedestrian behavior is unpredictable, and potholes are frequent. This entry documents the problem formulation and a proposed approach; no implementation or empirical results are claimed yet.",
    "category": "Applied Research",
    "domain": "Intelligent Transportation & Applied CV",
    "status": "Research Direction",
    "featured": false,
    "stack": [
      "Python",
      "PyTorch",
      "YOLO",
      "OpenCV",
      "Edge AI"
    ],
    "metrics": [
      {
        "label": "Project Stage",
        "value": "Research Direction",
        "subtext": "Problem formulation & proposed approach"
      },
      {
        "label": "Perception Targets",
        "value": "4 Core Classes",
        "subtext": "Potholes, non-lane vehicles, pedestrians, road boundaries"
      },
      {
        "label": "Target Deployment",
        "value": "Edge Device",
        "subtext": "Low-cost dashcam module with visual warnings"
      }
    ],
    "highlights": [
      "Research gap: popular driving datasets (KITTI, Waymo) assume lane-disciplined traffic that differs from South Asian roads.",
      "Proposed idea: a lightweight multi-task network for joint object detection and road-hazard segmentation.",
      "Considers edge hardware constraints for affordable, real-time deployment.",
      "Clearly separates the conceptual formulation from future empirical validation."
    ],
    "problem": "Public ADAS benchmarks assume disciplined lanes and uniform signage, leaving non-lane rickshaw traffic, erratic crossings, and potholes in Bangladesh poorly modeled.",
    "approach": "Formulated a research agenda around a lightweight multi-task perception network combining object detection and pothole/boundary segmentation suited to monocular dashcams.",
    "challenges": "Evaluating domain shift, collecting representative local dashcam data without overfitting, and balancing accuracy against affordable edge hardware latency remain open research questions.",
    "keyArchitecture": "Monocular Dashcam Feed → Shared Lightweight Backbone → Detection Head (vehicles, pedestrians) + Segmentation Head (potholes, drivable area) → Risk Heuristic → Driver Warning.",
    "hasDetailedCaseStudy": true
  },
  {
    "id": "personal-portfolio",
    "slug": "personal-portfolio",
    "title": "My Portfolio: Personal Developer & AI/ML Portfolio",
    "tagline": "Personal developer and AI/ML portfolio built with Next.js, React, TypeScript, Tailwind CSS, Three.js, and an interactive AI playground.",
    "summary": "A personal portfolio website showcasing my AI/ML and software engineering projects, verified model benchmarks, interactive AI simulators (embeddings, RAG pipeline, and vision bounding boxes), learning timeline, and research interests—complete with dark/light mode and a dynamic Admin Studio.",
    "category": "Systems & Web",
    "domain": "Personal Portfolio & Web Engineering",
    "status": "Completed",
    "featured": true,
    "featuredOrder": 6,
    "stack": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Three.js",
      "Framer Motion"
    ],
    "githubUrl": "https://github.com/anikdey095/portfolio-main",
    "metrics": [
      {
        "label": "Interactive Simulators",
        "value": "3",
        "subtext": "Embedding space, RAG chunking, and vision confidence"
      },
      {
        "label": "Theme & UI",
        "value": "Dark / Light",
        "subtext": "Responsive navy palette with subtle WebGL constellation"
      },
      {
        "label": "Content Studio",
        "value": "Dynamic",
        "subtext": "Built-in /admin dashboard & REST API routes"
      }
    ],
    "highlights": [
      "Human-centered dark navy design with circular portrait framing, subtle 3D WebGL constellation background, and light/dark theme toggle.",
      "Interactive AI Playground featuring client-side Embedding Space, RAG Chunking Pipeline, and Vision Bounding-Box simulators.",
      "Detailed engineering write-ups for every project covering problem statement, approach, architecture, and lessons learned.",
      "Built-in Dynamic Admin Studio (/admin) and REST API endpoints (/api/admin, /api/contact, /api/data) for managing content and messages."
    ],
    "problem": "Generic template portfolios often feel either overly flashy or too static to communicate real AI/ML engineering depth, experiments, and code trade-offs.",
    "approach": "Designed and built a custom Next.js + TypeScript portfolio combining personal storytelling, structured project write-ups, interactive AI concept simulators, and a local JSON-backed admin studio.",
    "challenges": "Balancing 3D WebGL visuals and interactive simulators with fast page loads and clean readability required lazy-loading Three.js scenes and keeping the visual hierarchy calm.",
    "keyArchitecture": "Next.js App Router (React 19 + TypeScript) → Tailwind CSS v4 + Three.js Hero → Structured Data & JSON Store (content.json) → /api/admin & /api/contact Route Handlers.",
    "hasDetailedCaseStudy": true
  }
];
