import { SkillCategory } from "@/types/portfolio";

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    title: "Programming Foundations",
    description: "Core languages utilized for AI/ML development, competitive programming, and full-stack software engineering.",
    items: [
      {
        name: "Python",
        status: "Building with",
        focusArea: "Primary AI/ML & Backend Language",
        context: "Scikit-learn, TensorFlow/Keras, PyTorch, LangChain, FastAPI, Flask, Streamlit, Pandas, NumPy",
      },
      {
        name: "C++",
        status: "Building with",
        focusArea: "Competitive Programming & DSA",
        context: "STL, sorting/searching, dynamic programming, graph algorithms across Codeforces, LeetCode, CodeChef",
      },
      {
        name: "C",
        status: "Working with",
        focusArea: "Foundational Programming",
        context: "Pointers, memory fundamentals, core algorithmic logic and structured programming",
      },
      {
        name: "TypeScript & JavaScript",
        status: "Building with",
        focusArea: "Full-Stack & In-Browser AI Apps",
        context: "Next.js, React, TensorFlow.js, Node.js, Express REST APIs, interactive web frontends",
      },
      {
        name: "Java",
        status: "Working with",
        focusArea: "Object-Oriented Systems",
        context: "Java Swing/JFrame desktop UIs, JDBC/MySQL integration (University Management System)",
      },
      {
        name: "SQL",
        status: "Building with",
        focusArea: "Relational Data Modeling",
        context: "PostgreSQL with Prisma ORM (StudyHub), MySQL schema design and queries",
      },
    ],
  },
  {
    id: "machine-learning",
    title: "Applied Machine Learning",
    description: "Supervised classification, feature analysis, comparative benchmarking, and production serving.",
    items: [
      {
        name: "Scikit-learn",
        status: "Building with",
        focusArea: "Model Pipelines & Ensembles",
        context: "Random Forest, Decision Tree, Logistic Regression, StandardScaler, joblib serialization in CropPulse AI",
      },
      {
        name: "Pandas & NumPy",
        status: "Building with",
        focusArea: "Tabular Data Manipulation",
        context: "Dataset cleaning, summary statistics, feature transformation, numerical preprocessing",
      },
      {
        name: "Classification & Ensemble Modeling",
        status: "Building with",
        focusArea: "Multi-Class Supervised Learning",
        context: "22-class crop prediction with probability ranking, confidence scores, and fallback JSON tree inference",
      },
      {
        name: "Model Evaluation & Validation",
        status: "Focused on",
        focusArea: "Rigorous Benchmarking",
        context: "Stratified K-Fold CV, train/test splits, macro Precision/Recall/F1, confusion matrices",
      },
      {
        name: "Feature Importance & Analysis",
        status: "Building with",
        focusArea: "Domain Feature Insights",
        context: "Tree feature importances and agronomic nutrient gap analysis for interpretable advisories",
      },
    ],
  },
  {
    id: "deep-learning",
    title: "Deep Learning & NLP",
    description: "Neural network architectures, sequence modeling for NLP, regularization, and inference optimization.",
    items: [
      {
        name: "TensorFlow & Keras",
        status: "Building with",
        focusArea: "Sequence Modeling & Deployment",
        context: "Training and serving SimpleRNN, LSTM, GRU, and BiGRU emotion classifiers in Moodline",
      },
      {
        name: "PyTorch",
        status: "Working with",
        focusArea: "Deep Learning Framework",
        context: "Tensors, autograd, neural network modules, and applied computer vision / DL experimentation",
      },
      {
        name: "RNN / LSTM / GRU / BiGRU",
        status: "Building with",
        focusArea: "Recurrent Sequence Modeling",
        context: "6-class emotion classification on dair-ai/emotion with 300D embeddings and SpatialDropout",
      },
      {
        name: "CNNs",
        status: "Working with",
        focusArea: "Visual Feature Extraction",
        context: "Convolutional layers, pooling, batch normalization, and spatial pattern learning",
      },
      {
        name: "Transformers & Attention",
        status: "Exploring",
        focusArea: "Modern Neural Architectures",
        context: "Self-attention mechanisms, encoder/decoder LLMs, and fine-tuning workflows",
      },
    ],
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    description: "Real-time in-browser object detection, webcam pipelines, and applied perception research.",
    items: [
      {
        name: "TensorFlow.js & COCO-SSD",
        status: "Building with",
        focusArea: "Client-Side Object Detection",
        context: "Real-time webcam phone distraction detection (> 0.65 confidence) in FocusBell AI",
      },
      {
        name: "OpenCV",
        status: "Working with",
        focusArea: "Image & Video Processing",
        context: "Frame manipulation, color space transforms, filtering, and computer vision preprocessing",
      },
      {
        name: "Object Detection",
        status: "Focused on",
        focusArea: "Real-Time Visual Perception",
        context: "Bounding-box confidence thresholding, NMS concepts, and webcam stream lifecycle management",
      },
      {
        name: "YOLO Architectures",
        status: "Exploring",
        focusArea: "Edge Detection Research",
        context: "Studied single-stage detection for Bangladesh unstructured-road perception research direction",
      },
    ],
  },
  {
    id: "generative-ai",
    title: "LLMs, RAG & Agentic AI",
    description: "Document retrieval pipelines, semantic vector embeddings, open-weights/API LLMs, and agent workflows.",
    items: [
      {
        name: "RAG (Retrieval-Augmented Generation)",
        status: "Building with",
        focusArea: "Grounded Multi-PDF Q&A",
        context: "DocMind multi-PDF chatbot built with PyPDF extraction, chunking, vector retrieval, and chat memory",
      },
      {
        name: "LangChain",
        status: "Building with",
        focusArea: "LLM & Retrieval Orchestration",
        context: "CharacterTextSplitter (1000/200), ConversationalRetrievalChain, ConversationBufferMemory",
      },
      {
        name: "FAISS & Vector Search",
        status: "Building with",
        focusArea: "Dense Semantic Similarity",
        context: "In-memory FAISS indexing with 384D all-MiniLM-L6-v2 sentence-transformer embeddings",
      },
      {
        name: "LLMs (Llama 3.2 & GPT-3.5)",
        status: "Building with",
        focusArea: "Multi-Provider Inference",
        context: "meta-llama/Llama-3.2-3B-Instruct via Hugging Face Inference API and OpenAI gpt-3.5-turbo",
      },
      {
        name: "Agentic AI & Reranking",
        status: "Exploring",
        focusArea: "Hybrid Retrieval & Tool Use",
        context: "Hybrid BM25 + dense fusion, cross-encoder rerankers, and ReAct tool-calling verification loops",
      },
    ],
  },
  {
    id: "engineering",
    title: "Software, APIs & Deployment",
    description: "Backend APIs, full-stack web applications, databases, containerization, and cloud deployment.",
    items: [
      {
        name: "FastAPI & Flask",
        status: "Building with",
        focusArea: "ML Model Serving APIs",
        context: "Moodline async FastAPI backend (Swagger/ReDoc) and CropPulse AI serverless Flask API",
      },
      {
        name: "Next.js, React & Tailwind CSS",
        status: "Building with",
        focusArea: "Modern Web Applications",
        context: "StudyHub (Next.js 14 App Router + TypeScript), FocusBell AI (React + Vite), and portfolio",
      },
      {
        name: "Node.js, Express & Prisma ORM",
        status: "Building with",
        focusArea: "Full-Stack REST Backends",
        context: "StudyHub modular backend with JWT auth, bcrypt, Helmet, rate limiting, and Multer uploads",
      },
      {
        name: "PostgreSQL, MySQL & MongoDB",
        status: "Building with",
        focusArea: "Database Engineering",
        context: "StudyHub (PostgreSQL + Prisma), University-management & blood-donation-system (MySQL), MongoDB",
      },
      {
        name: "Docker & Cloud Deployment",
        status: "Building with",
        focusArea: "Reproducible Environments & Hosting",
        context: "Dockerfiles with health checks, Render blueprints, Vercel serverless deployments, Streamlit",
      },
      {
        name: "Git & GitHub",
        status: "Building with",
        focusArea: "Version Control & Documentation",
        context: "Clean repository structure, automated test scripts (test_app.py), technical READMEs",
      },
    ],
  },
];
