import { JourneyMilestone } from "@/types/portfolio";

export const journeyMilestones: JourneyMilestone[] = [
  {
    "step": "01",
    "title": "Programming & Algorithmic Foundations",
    "domain": "C, C++, Java, PHP, Data Structures, Algorithms",
    "period": "Foundational Phase",
    "description": "Built computational problem-solving foundations through competitive programming and university systems projects. Practiced algorithmic problem solving across Codeforces, LeetCode, CodeChef, and ACM contests, and built database-backed software systems in Java and PHP/MySQL.",
    "focusPoints": [
      "Practiced sorting, searching, recursion, dynamic programming, and graph algorithms in C and C++ across Codeforces, LeetCode, CodeChef, and ACM contest repositories.",
      "Developed University-management with Java Swing/JFrame and MySQL featuring separate admin, faculty, and student dashboards.",
      "Built and deployed blood-donation-system-master with PHP and MySQL for donor, patient, and donation record tracking."
    ],
    "keyOutcome": "Strong algorithmic thinking and core software engineering discipline."
  },
  {
    "step": "02",
    "title": "Applied Machine Learning & Statistical Modeling",
    "domain": "Python, Scikit-learn, Pandas, Flask, Vercel",
    "period": "Core ML Phase",
    "description": "Transitioned into tabular machine learning and end-to-end model deployment. Designed CropPulse AI to recommend optimal crops across 22 agricultural classes from soil macronutrients and micro-climatic inputs.",
    "focusPoints": [
      "Evaluated Random Forest (99.55% test / 99.59% 5-fold stratified CV), Decision Tree (97.95%), and Logistic Regression (95.00%) on 2,200 samples.",
      "Analyzed feature importance across rainfall (23.39%), humidity (22.55%), K (17.49%), P (15.04%), N (9.50%), temperature (7.27%), and pH (4.76%).",
      "Shipped a dual-engine Flask API on Vercel combining scikit-learn/joblib with a 0.68 ms zero-dependency JSON decision-tree fallback and Open-Meteo autofill."
    ],
    "keyOutcome": "Practical mastery of comparative benchmarking and serverless ML serving."
  },
  {
    "step": "03",
    "title": "Deep Learning & NLP Sequence Modeling",
    "domain": "TensorFlow, Keras, PyTorch, BiGRU / LSTM, FastAPI, Docker",
    "period": "Deep Learning Phase",
    "description": "Moved into deep neural sequence modeling and containerized NLP inference. Built Moodline on the Hugging Face dair-ai/emotion dataset to classify text into six emotions: joy, sadness, love, anger, fear, and surprise.",
    "focusPoints": [
      "Trained and benchmarked SimpleRNN (~78.4%), LSTM (~86.2%), GRU (~87.8%), and Bidirectional GRU (~90.1%) with 300D embeddings and SpatialDropout.",
      "Built an async FastAPI service with /predict and /health endpoints, Swagger/ReDoc documentation, and resilient Keras 3 deserialization.",
      "Containerized the pipeline with Docker (non-root user, health checks), wrote a 5-test automated suite, and deployed live on Render."
    ],
    "keyOutcome": "Hands-on experience taking recurrent deep learning models from notebooks to Dockerized APIs."
  },
  {
    "step": "04",
    "title": "Computer Vision & In-Browser Inference",
    "domain": "TensorFlow.js, COCO-SSD, OpenCV, React, Vite",
    "period": "Computer Vision Phase",
    "description": "Explored real-time visual perception directly inside the web browser without transmitting webcam video to external servers. Built FocusBell AI to pair a configurable focus timer with automated smartphone distraction detection.",
    "focusPoints": [
      "Integrated pre-trained COCO-SSD via @tensorflow-models/coco-ssd and @tensorflow/tfjs on a 640×480 webcam MediaStream.",
      "Implemented continuous requestAnimationFrame inference filtering for 'cell phone' detections above 0.65 confidence.",
      "Added a 4-second alert cooldown, audio alert feedback, and automatic session reset, deployed on Vercel."
    ],
    "keyOutcome": "Ability to run privacy-preserving client-side computer vision in interactive web applications."
  },
  {
    "step": "05",
    "title": "Large Language Models & Semantic Embeddings",
    "domain": "Llama 3.2, OpenAI GPT-3.5, Hugging Face, Sentence-Transformers",
    "period": "Generative AI Phase",
    "description": "Investigated open-weights and API-hosted LLMs alongside dense semantic representations. Worked with sentence-transformer embeddings, temperature and token calibration, and multi-provider LLM orchestration.",
    "focusPoints": [
      "Generated 384-dimensional dense vector representations using all-MiniLM-L6-v2 for semantic document retrieval.",
      "Integrated dual inference providers: meta-llama/Llama-3.2-3B-Instruct via Hugging Face Inference API and OpenAI gpt-3.5-turbo.",
      "Handled edge cases gracefully, including missing API credentials, quota exhaustion fallbacks, and unextractable scanned PDFs."
    ],
    "keyOutcome": "Practical command over embedding pipelines and multi-backend LLM integration."
  },
  {
    "step": "06",
    "title": "RAG & Agentic Systems Exploration",
    "domain": "LangChain, FAISS, Streamlit, Two-Stage Retrieval, Agentic AI",
    "period": "Active Building Phase",
    "description": "Built DocMind for conversational Q&A over multiple uploaded PDFs using LangChain and FAISS, while actively studying advanced RAG techniques — hybrid sparse-dense retrieval, cross-encoder reranking, and agentic tool-use workflows.",
    "focusPoints": [
      "Implemented multi-PDF ingestion with PyPDF, CharacterTextSplitter (1000 chars, 200 overlap), FAISS indexing, and ConversationBufferMemory.",
      "Studying Reciprocal Rank Fusion (BM25 + dense embeddings) and cross-encoder reranking to reduce noisy context chunks.",
      "Exploring structured agentic patterns including ReAct tool calling and verification loops."
    ],
    "keyOutcome": "Building grounded document-intelligence systems and studying reliable retrieval architectures."
  },
  {
    "step": "07",
    "title": "Full-Stack Systems & Applied AI Research Direction",
    "domain": "Next.js, TypeScript, Express, Prisma, PostgreSQL, Applied CV Research",
    "period": "Current Focus & Graduate Trajectory",
    "description": "Combined full-stack engineering in StudyHub (Next.js 14 + Express + Prisma + PostgreSQL) with an active undergraduate research direction on computer vision for Bangladesh's unstructured roadways, preparing for December 2026 graduation, AI/ML engineering roles, and international Master's programs.",
    "focusPoints": [
      "Built StudyHub with Next.js 14 App Router, Express REST APIs, Prisma ORM, PostgreSQL, JWT auth, and a dynamic course/notes/research portal.",
      "Formulating an applied computer vision research agenda addressing non-lane South Asian traffic, local vehicle classes, and road hazards.",
      "Preparing academic and technical portfolio for AI/ML internships, engineering positions, and graduate applications abroad."
    ],
    "keyOutcome": "Bridging full-stack AI engineering with focused preparation for applied research."
  }
];
