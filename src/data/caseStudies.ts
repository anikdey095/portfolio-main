import { ProjectCaseStudy } from "@/types/portfolio";

export const caseStudies: Record<string, ProjectCaseStudy> = {
  "crop-recommendation": {
    projectId: "crop-recommendation",
    slug: "crop-recommendation",
    title: "CropPulse AI: Precision Crop Recommendation System",
    subtitle:
      "Soil and climate feature modeling, multi-model benchmarking, and a serverless Flask deployment with a zero-dependency fallback engine.",
    sections: {
      overview: {
        number: "01",
        title: "Overview",
        content:
          "CropPulse AI recommends the most suitable crop for a field from seven agronomic inputs: nitrogen (N), phosphorus (P), potassium (K), temperature, relative humidity, soil pH, and rainfall. The project spans the full ML lifecycle — exploratory analysis and model comparison in a Jupyter notebook, an automated training script, a Flask API, an interactive web frontend, automated tests, and deployment on Vercel.",
        bullets: [
          "Production model: Random Forest ensemble (80 trees, max depth 16).",
          "99.55% test accuracy and 99.59% mean 5-fold stratified cross-validation accuracy.",
          "Live at crop-recommendation-zeta.vercel.app.",
        ],
      },
      problem: {
        number: "02",
        title: "Problem Statement",
        content:
          "Choosing a crop that matches local soil chemistry and climate is critical for yield, yet farmers and students rarely have an easy, data-driven way to compare candidates. The task is framed as a 22-class supervised classification problem: given a soil and weather profile, predict the best-suited crop and explain how the inputs align with that crop's ideal ranges.",
      },
      motivation: {
        number: "03",
        title: "Motivation",
        content:
          "Agriculture is central to Bangladesh's economy. I wanted to build a practical ML system that goes beyond a notebook accuracy score — something a user can actually open in a browser, enter values or use presets, and receive an interpretable recommendation with fertilizer guidance.",
      },
      dataset: {
        number: "04",
        title: "Dataset & Features",
        content:
          "The model is trained on a 2,200-sample soil and climate dataset (data.csv) covering 22 crops, including rice, maize, chickpea, lentil, mango, banana, apple, coffee, cotton, and jute.",
        table: {
          headers: ["Feature", "Range in Dataset", "Feature Importance"],
          rows: [
            ["Rainfall (mm)", "20.2 – 298.6", "23.39%"],
            ["Humidity (%)", "14.3 – 100.0", "22.55%"],
            ["Potassium (K)", "5 – 205", "17.49%"],
            ["Phosphorus (P)", "5 – 145", "15.04%"],
            ["Nitrogen (N)", "0 – 140", "9.50%"],
            ["Temperature (°C)", "8.8 – 43.7", "7.27%"],
            ["Soil pH", "3.5 – 9.9", "4.76%"],
          ],
          caption: "Feature ranges and Random Forest feature importances from model_metrics.json",
        },
      },
      dataProcessing: {
        number: "05",
        title: "Data Preparation",
        content:
          "Features were separated from the crop label, split into training and test sets with a 20% stratified hold-out (440 samples), and standardized with StandardScaler for the linear and tree baselines explored in the notebook. Stratification keeps all 22 classes proportionally represented in both splits.",
      },
      baseline: {
        number: "06",
        title: "Baseline Models",
        content:
          "Logistic Regression and a single Decision Tree served as baselines against which the ensemble was compared. Each model was evaluated on accuracy, macro precision, macro recall, and macro F1-score, with confusion matrices plotted to inspect per-class behavior.",
      },
      architecture: {
        number: "07",
        title: "Model Comparison",
        content:
          "All three candidate models were evaluated on the same stratified test split and with 5-fold stratified cross-validation.",
        table: {
          headers: ["Model", "Test Accuracy", "5-Fold Stratified CV", "Inference Time", "Role"],
          rows: [
            ["Random Forest (80 trees)", "99.55%", "99.59% ± 0.3%", "0.68 ms", "Production"],
            ["Decision Tree", "97.95%", "98.77% ± 0.7%", "0.21 ms", "Baseline"],
            ["Logistic Regression", "95.00%", "97.36% ± 0.2%", "0.15 ms", "Linear baseline"],
          ],
          caption: "Results reported in the project README and model_metrics.json",
        },
      },
      methodology: {
        number: "08",
        title: "Methodology",
        content:
          "Model selection balanced accuracy, cross-validated stability, and inference cost. Random Forest delivered the highest test and CV accuracy with low variance while remaining fast enough for real-time API use, so it was chosen for production. A training script (train.py) automates model fitting and serializes both the joblib model and a JSON representation of the trees.",
      },
      experiments: {
        number: "09",
        title: "Experiments & Results",
        content:
          "Random Forest reached 99.55% test accuracy and 99.55% F1-score, outperforming the Decision Tree by 1.6 points and Logistic Regression by 4.55 points. Feature importance analysis showed rainfall and humidity as the strongest discriminators, followed by potassium and phosphorus.",
        bullets: [
          "Rainfall (23.39%) and humidity (22.55%) separate arid crops from tropical, water-intensive crops.",
          "Potassium is a strong marker for fruits such as apple, grapes, and banana.",
          "Soil pH contributed least (4.76%) on this dataset.",
        ],
      },
      evaluation: {
        number: "10",
        title: "Evaluation Metrics",
        content:
          "Accuracy, macro precision, macro recall, and macro F1-score were computed on the stratified hold-out set, alongside 5-fold stratified cross-validation to check that results were not an artifact of a single split. Confusion matrices were used to inspect class-level errors.",
      },
      errorAnalysis: {
        number: "11",
        title: "Error Analysis",
        content:
          "With 99.55% accuracy, only about 2 of 440 test samples were misclassified. The very high score also reflects that this public dataset has well-separated class distributions; real field data would likely be noisier, which is why the app pairs predictions with suitability analysis rather than presenting them as certainties.",
      },
      engineeringDecisions: {
        number: "12",
        title: "Engineering Decisions",
        content:
          "To avoid serverless cold-start or dependency issues, the API uses a dual-engine design: the primary engine loads the scikit-learn/joblib model, while a fallback engine evaluates the same decision-tree ensemble from a serialized JSON file in pure Python with zero C-extension dependencies.",
        bullets: [
          "Primary engine: scikit-learn + joblib compressed model (~374 KB).",
          "Fallback engine: pure JSON decision-tree evaluator for serverless reliability.",
          "Static frontend assets served via Vercel's edge CDN.",
        ],
      },
      challenges: {
        number: "13",
        title: "Challenges",
        content:
          "The main challenge was moving from a notebook to a reliable serverless deployment: keeping the bundle small (datasets and notebooks are excluded via .vercelignore), handling model loading inside Vercel's Python runtime, and keeping frontend inputs (sliders and number fields) synchronized with API requests.",
      },
      deployment: {
        number: "14",
        title: "Deployment & Interface",
        content:
          "The application is deployed on Vercel with a Flask/WSGI serverless handler and exposes a REST API alongside a responsive single-page web app.",
        bullets: [
          "POST /api/predict — returns the crop, confidence, alternates, and per-nutrient suitability analysis.",
          "GET /api/crops, /api/presets, /api/model-info, /api/health endpoints.",
          "10 one-click agro-ecological presets and real-time weather autofill via Open-Meteo + GPS.",
          "Nutrient gap analysis with fertilizer schedules (Urea, DAP, MOP, Lime) and a crop encyclopedia.",
          "Automated 10-test suite covering model artifacts, health checks, predictions, and error handling.",
        ],
      },
      limitations: {
        number: "15",
        title: "Known Limitations",
        content:
          "The model is trained on a single public dataset of 2,200 samples and has not been validated on field data from specific regions. Recommendations do not account for market prices, irrigation availability, or seasonal timing, so they should be treated as decision support rather than agronomic advice.",
      },
      futureWork: {
        number: "16",
        title: "Future Work",
        content:
          "Validate the model on region-specific soil-test data from Bangladesh, add calibrated probability estimates, incorporate seasonal and market factors, and explore explainability tools such as SHAP for per-prediction explanations.",
      },
      links: {
        github: "https://github.com/anikdey095/crop-recommendation",
        demo: "https://crop-recommendation-zeta.vercel.app",
      },
    },
  },
  "moodline-sentiment": {
    projectId: "moodline-sentiment",
    slug: "moodline-sentiment",
    title: "Moodline: Deep Learning Sentiment & Emotion Intelligence",
    subtitle:
      "Comparing RNN, LSTM, GRU, and BiGRU architectures for six-class emotion classification, served with FastAPI and Docker.",
    sections: {
      overview: {
        number: "01",
        title: "Overview",
        content:
          "Moodline is an end-to-end deep learning and NLP system that detects the emotion expressed in a piece of text. It classifies input into six emotions — joy, sadness, love, anger, fear, and surprise — using a Bidirectional GRU (BiGRU) model with 300-dimensional embeddings, and serves predictions in real time through an asynchronous FastAPI backend with an interactive web interface.",
        bullets: [
          "Four sequence architectures trained and compared.",
          "Selected BiGRU model: ~90.1% test accuracy.",
          "Live at moodline-sentiment.onrender.com (Render free tier; allow time for cold starts).",
        ],
      },
      problem: {
        number: "02",
        title: "Problem Statement",
        content:
          "Binary positive/negative sentiment loses much of the nuance in human language. The goal was to build a multi-class emotion classifier that captures finer affective states and make it usable through a production-style API and web UI.",
      },
      motivation: {
        number: "03",
        title: "Motivation",
        content:
          "I wanted hands-on experience with recurrent neural networks and to understand, through direct comparison, how gating mechanisms and bidirectionality affect performance on real text — then take the best model all the way to deployment.",
      },
      dataset: {
        number: "04",
        title: "Dataset",
        content:
          "Models were trained on the Hugging Face dair-ai/emotion benchmark, loaded through Hugging Face Datasets. Each sample is a short English text labeled with one of six emotions. The fitted tokenizer has a vocabulary of roughly 15,000 words.",
      },
      dataProcessing: {
        number: "05",
        title: "Text Preprocessing",
        content:
          "Raw text is lowercased, cleaned with regular expressions, and normalized for contractions before tokenization. Sequences are padded or truncated to a maximum length of 50 tokens.",
        bullets: [
          "Lowercasing, regex cleaning, and contraction normalization.",
          "Keras tokenizer (saved as tokenizer.pkl) for consistent inference-time preprocessing.",
          "Sequence padding to length 50.",
        ],
      },
      baseline: {
        number: "06",
        title: "Baseline Model",
        content:
          "A SimpleRNN served as the baseline recurrent network. It reached about 78.4% test accuracy, struggling with longer-range dependencies — the gap that motivated the gated architectures.",
      },
      architecture: {
        number: "07",
        title: "Model Architecture",
        content:
          "The selected model stacks two bidirectional GRU layers on top of a trainable embedding layer.",
        codeSnippet: {
          language: "text",
          code: "Embedding(input_dim=10000, output_dim=300)\nBidirectional(GRU(128, return_sequences=True))\nSpatialDropout(0.5)\nBidirectional(GRU(64))\nDropout(0.5)\nDense(6, activation=\"softmax\")",
          caption: "BiGRU architecture as documented in the project README",
        },
      },
      methodology: {
        number: "08",
        title: "Methodology",
        content:
          "Four architectures were trained under the same preprocessing pipeline in the sentiment_analysis.ipynb notebook and compared on held-out test accuracy. Dropout and spatial dropout were used for regularization. The best model was saved in the Keras format together with its tokenizer for serving.",
      },
      experiments: {
        number: "09",
        title: "Comparative Results",
        content:
          "Gated architectures clearly outperformed the vanilla RNN, and processing context in both directions gave BiGRU the best accuracy.",
        table: {
          headers: ["Architecture", "Parameters", "Test Accuracy"],
          rows: [
            ["SimpleRNN", "~1.3M", "~78.4%"],
            ["LSTM", "~1.6M", "~86.2%"],
            ["GRU", "~1.5M", "~87.8%"],
            ["BiGRU (selected)", "~2.1M", "~90.1%"],
          ],
          caption: "Approximate results reported in the project README",
        },
      },
      evaluation: {
        number: "10",
        title: "Evaluation",
        content:
          "Models were compared on test-set accuracy. At inference time the API returns the full softmax probability distribution over all six emotions, along with prediction latency, so users can see the model's confidence rather than a single label.",
      },
      errorAnalysis: {
        number: "11",
        title: "Error Considerations",
        content:
          "Emotion labels are inherently overlapping (for example, joy and love, or fear and surprise), and short texts can be ambiguous. Exposing the full probability spectrum in the UI makes these borderline cases visible instead of hiding them behind one label.",
      },
      engineeringDecisions: {
        number: "12",
        title: "Engineering Decisions",
        content:
          "FastAPI was chosen for asynchronous serving, Pydantic validation, and auto-generated Swagger/ReDoc documentation. A compatibility layer handles Keras 3 cross-version deserialization issues so the saved model loads reliably in production.",
        bullets: [
          "Async FastAPI with /predict and /health endpoints.",
          "Dockerfile with a non-root user, layer caching, and built-in health checks.",
          "render.yaml blueprint and Procfile for one-click cloud deployment.",
        ],
      },
      challenges: {
        number: "13",
        title: "Challenges",
        content:
          "Loading a Keras model saved in one version under another (e.g. unexpected serialization fields such as quantization_config) required a resilient deserialization layer. Deploying on Render's free tier also meant designing for cold starts and model warm-up.",
      },
      deployment: {
        number: "14",
        title: "Deployment & Interface",
        content:
          "The service is deployed on Render and includes a web console with one-click test chips for each emotion, an animated probability breakdown, latency telemetry, session history, and optional Web Audio feedback.",
        bullets: [
          "Live app: moodline-sentiment.onrender.com",
          "API docs at /docs (Swagger) and /redoc.",
          "Automated end-to-end test suite (test_app.py) for health, prediction, validation, and static serving.",
        ],
      },
      limitations: {
        number: "15",
        title: "Limitations",
        content:
          "The model is trained only on English text from a single benchmark, uses a fixed 50-token window, and predicts exactly one of six emotions. It may not generalize to other domains, longer documents, sarcasm, or mixed emotions.",
      },
      futureWork: {
        number: "16",
        title: "Future Work",
        content:
          "Compare against transformer-based models (e.g. fine-tuned DistilBERT), add per-class precision/recall and confusion-matrix reporting, and explore multi-label emotion prediction and Bangla-language support.",
      },
      links: {
        github: "https://github.com/anikdey095/Deep_Learning_Project_Sentiment_analysis",
        demo: "https://moodline-sentiment.onrender.com/",
      },
    },
  },
  "docmind-rag": {
    projectId: "docmind-rag",
    slug: "docmind-rag",
    title: "DocMind: Multi-PDF RAG Q&A Chatbot",
    subtitle:
      "Retrieval-Augmented Generation with LangChain, FAISS, sentence-transformer embeddings, and switchable Llama 3.2 / GPT-3.5 backends.",
    sections: {
      overview: {
        number: "01",
        title: "Overview",
        content:
          "DocMind is a conversational Retrieval-Augmented Generation (RAG) assistant for chatting with one or more PDF documents at once. Users upload PDFs, process them into a vector index, and ask natural-language questions; answers are generated from the retrieved document context, with conversation memory for follow-up questions.",
        bullets: [
          "Multi-PDF ingestion into a single knowledge base.",
          "Local FAISS vector search with all-MiniLM-L6-v2 embeddings.",
          "Switchable LLM backend: Llama-3.2-3B-Instruct (Hugging Face) or GPT-3.5-Turbo (OpenAI).",
        ],
      },
      problem: {
        number: "02",
        title: "Problem Statement",
        content:
          "LLMs on their own cannot answer questions about private or newly provided documents and may hallucinate. Reading long PDFs manually to find specific answers is slow. RAG addresses both issues by retrieving relevant passages and supplying them to the LLM as context.",
      },
      motivation: {
        number: "03",
        title: "Motivation",
        content:
          "This project was my hands-on entry into LLM application engineering — learning how chunking, embeddings, vector search, prompt assembly, and conversational memory fit together in a working RAG pipeline.",
      },
      dataset: {
        number: "04",
        title: "Knowledge Source",
        content:
          "The knowledge base is whatever the user uploads: one or multiple text-based PDFs. Text is extracted page by page with PyPDF's PdfReader and combined into a unified corpus for the current session.",
      },
      dataProcessing: {
        number: "05",
        title: "Chunking & Embedding",
        content:
          "Extracted text is split with LangChain's CharacterTextSplitter into 1,000-character chunks with 200 characters of overlap so that context is preserved across chunk boundaries. Each chunk is embedded with the sentence-transformers all-MiniLM-L6-v2 model (384-dimensional vectors).",
      },
      baseline: {
        number: "06",
        title: "Retrieval Approach",
        content:
          "Retrieval uses single-stage dense vector similarity search over an in-memory FAISS index. This is the standard RAG baseline — simple, fast, and fully local — and a starting point for future improvements such as hybrid search and reranking.",
      },
      architecture: {
        number: "07",
        title: "System Architecture",
        content:
          "Ingestion: PDF upload → PyPDF extraction → chunking (1000/200) → MiniLM embeddings → FAISS index. Query: user question → similarity search → ConversationalRetrievalChain (with ConversationBufferMemory) → selected LLM → answer rendered in the Streamlit chat UI.",
      },
      methodology: {
        number: "08",
        title: "Orchestration",
        content:
          "LangChain's ConversationalRetrievalChain handles question condensation, retrieval, prompt formatting, and the LLM call, while ConversationBufferMemory keeps the full chat history so follow-up questions are interpreted in context.",
      },
      experiments: {
        number: "09",
        title: "Configuration",
        content:
          "Key parameters are defined in app.py and documented in the README.",
        table: {
          headers: ["Parameter", "Default"],
          rows: [
            ["Embedding model", "all-MiniLM-L6-v2"],
            ["Chunk size / overlap", "1000 / 200 characters"],
            ["Hugging Face LLM", "meta-llama/Llama-3.2-3B-Instruct"],
            ["HF temperature / max tokens", "0.1 / 512"],
            ["OpenAI model", "gpt-3.5-turbo"],
          ],
          caption: "Default configuration from the project README",
        },
      },
      evaluation: {
        number: "10",
        title: "Evaluation",
        content:
          "The application was validated through manual question-answering on uploaded documents. Formal RAG evaluation (e.g. context relevance, faithfulness, and answer relevance scoring) has not yet been performed and is listed as future work.",
      },
      errorAnalysis: {
        number: "11",
        title: "Failure Modes Handled",
        content:
          "The app detects and reports common failure cases instead of failing silently.",
        bullets: [
          "Scanned or image-only PDFs with no extractable text.",
          "Missing or invalid Hugging Face / OpenAI API keys (including 401 errors).",
          "OpenAI quota exhaustion, with a hint to switch to the Hugging Face backend.",
        ],
      },
      engineeringDecisions: {
        number: "12",
        title: "Engineering Decisions",
        content:
          "Embeddings run locally with sentence-transformers to avoid paid embedding APIs, and FAISS keeps vector search fast and in-memory. Supporting both Hugging Face and OpenAI backends lets the app run on a free tier while still allowing GPT-3.5 when a key is available. Environment-variable aliases make API-key configuration forgiving.",
      },
      challenges: {
        number: "13",
        title: "Challenges",
        content:
          "Integrating two different LLM providers behind one chain, handling provider-specific errors gracefully, and choosing chunk sizes that balance retrieval precision with enough surrounding context.",
      },
      deployment: {
        number: "14",
        title: "Running the App",
        content:
          "DocMind runs locally as a Streamlit application (streamlit run app.py) with API keys supplied through a .env file. The UI includes a sidebar for model selection, PDF upload and processing, and clearing the chat history.",
      },
      limitations: {
        number: "15",
        title: "Limitations",
        content:
          "Retrieval is single-stage dense search without reranking; the FAISS index is in-memory and rebuilt per session; scanned PDFs require OCR beforehand; and answers are not yet shown with source citations.",
      },
      futureWork: {
        number: "16",
        title: "Future Work",
        content:
          "Add source citations, hybrid BM25 + dense retrieval with cross-encoder reranking, persistent vector storage, OCR for scanned documents, systematic RAG evaluation, and agentic tool-use workflows.",
      },
      links: {
        github: "https://github.com/anikdey095/Chat-with-Multiple-PDFs",
      },
    },
  },
  "focusbell-ai": {
    projectId: "focusbell-ai",
    slug: "focusbell-ai",
    title: "FocusBell AI: In-Browser Phone Distraction Detector",
    subtitle:
      "A focus timer powered by real-time COCO-SSD object detection in TensorFlow.js — detect the phone, sound the alert, reset the session.",
    sections: {
      overview: {
        number: "01",
        title: "Overview",
        content:
          "FocusBell AI is a study-focus web app that pairs a countdown timer with real-time computer vision. While a session is running, a pre-trained COCO-SSD object detector watches the webcam feed in the browser; if a phone appears, the app plays an audio alert, switches to a warning state, and resets the timer to the full session length.",
        bullets: [
          "Real-time object detection with TensorFlow.js and COCO-SSD.",
          "Webcam frames are processed locally in the browser.",
          "Live at mobile-detector.vercel.app.",
        ],
      },
      problem: {
        number: "02",
        title: "Problem Statement",
        content:
          "Smartphones are one of the biggest sources of distraction during study sessions. Ordinary Pomodoro timers cannot tell whether the user actually stayed off their phone; FocusBell adds accountability by detecting phone use automatically.",
      },
      motivation: {
        number: "03",
        title: "Motivation",
        content:
          "I wanted to apply computer vision to an everyday problem I face myself and learn how to run deep learning models directly in the browser, without a backend server.",
      },
      dataset: {
        number: "04",
        title: "Model",
        content:
          "The app uses the pre-trained COCO-SSD model from @tensorflow-models/coco-ssd, which detects 80 object categories from the MS-COCO dataset, including 'cell phone'. No custom training was performed; the focus was on integrating and applying the model in a real-time application.",
      },
      dataProcessing: {
        number: "05",
        title: "Frame Pipeline",
        content:
          "The webcam is opened with getUserMedia at 640×480 using the front-facing camera. Once the video stream is ready, a detection loop runs model.detect() on the video element and schedules the next frame with requestAnimationFrame.",
      },
      baseline: {
        number: "06",
        title: "Detection Rule",
        content:
          "A frame counts as a distraction when any prediction has the class 'cell phone' with a confidence score above 0.65 — a threshold chosen to reduce false alarms from objects that only loosely resemble a phone.",
      },
      architecture: {
        number: "07",
        title: "System Architecture",
        content:
          "Webcam MediaStream → HTML5 video element → COCO-SSD detection loop (TensorFlow.js) → phone-detected callback → cooldown gate → audio alert, warning UI, and timer reset. The timer and detector are separate React components connected through callbacks.",
      },
      methodology: {
        number: "08",
        title: "Session Logic",
        content:
          "Users set hours, minutes, and seconds (25 minutes by default) and launch a session. Detection only affects the session while it is active and not paused. When the countdown reaches zero without interruption, the session is marked as successful.",
      },
      experiments: {
        number: "09",
        title: "Alert Behaviour",
        content:
          "On a detection, the app plays an audio clip from the start, shows a red warning state, and resets the remaining time to the original session length. A 4-second cooldown prevents a single phone sighting from triggering repeated alerts.",
      },
      evaluation: {
        number: "10",
        title: "Evaluation",
        content:
          "The app was tested manually in real usage on desktop browsers with a webcam. Quantitative benchmarks such as detection precision or frame rate have not been formally measured.",
      },
      errorAnalysis: {
        number: "11",
        title: "Failure Modes",
        content:
          "Detection quality depends on lighting, camera angle, and how much of the phone is visible. Phones held below the camera's field of view will not be detected, and similar-looking rectangular objects could occasionally trigger false positives.",
      },
      engineeringDecisions: {
        number: "12",
        title: "Key Engineering Decisions",
        content:
          "Running inference client-side with TensorFlow.js means no video is uploaded to a server and no backend infrastructure is needed. Using a pre-trained COCO-SSD model provided reliable phone detection without collecting a custom dataset.",
      },
      challenges: {
        number: "13",
        title: "Challenges",
        content:
          "Managing the camera lifecycle (starting and stopping tracks when sessions start, pause, or end), handling denied camera permissions and model-loading errors gracefully, and coordinating the detection loop with timer state in React.",
      },
      deployment: {
        number: "14",
        title: "Frontend Stack & Deployment",
        content:
          "Built with React and Vite, styled with Tailwind CSS, animated with Framer Motion, and deployed on Vercel. Includes loading and error states for model initialization and webcam access.",
      },
      limitations: {
        number: "15",
        title: "Limitations",
        content:
          "Requires a webcam and camera permission; performance depends on the user's device; only phone detection is supported; and session history and analytics are not stored.",
      },
      futureWork: {
        number: "16",
        title: "Future Work",
        content:
          "Add multi-frame confirmation to further reduce false positives, session statistics and distraction logs, a fine-tuned lighter detector for phones, and support for additional distraction signals.",
      },
      links: {
        github: "https://github.com/anikdey095/mobile-detector",
        demo: "https://mobile-detector.vercel.app",
      },
    },
  },
  studyhub: {
    projectId: "studyhub",
    slug: "studyhub",
    title: "StudyHub: Academic Collaboration Platform",
    subtitle:
      "A full-stack Next.js + Express + Prisma + PostgreSQL platform for study materials, course catalogs, careers, and research preprints.",
    sections: {
      overview: {
        number: "01",
        title: "Overview",
        content:
          "StudyHub connects university students across departments in one collaborative platform. It combines a study-notes repository, departmental course catalogs, a career/tuition/internship board, a research preprints portal, and student profiles, backed by an admin hub for managing content.",
        bullets: [
          "Next.js 14 App Router frontend in TypeScript.",
          "Node.js/Express REST API with Prisma ORM and PostgreSQL.",
          "JWT authentication, file uploads, and admin management.",
        ],
      },
      problem: {
        number: "02",
        title: "Problem Statement",
        content:
          "University study materials — lecture notes, cheat sheets, past question solutions — are scattered across messaging groups and personal drives, and opportunities such as tuitions and internships are hard to discover. StudyHub centralizes these resources in a searchable, organized platform.",
      },
      motivation: {
        number: "03",
        title: "Motivation",
        content:
          "As a student I experienced this fragmentation first-hand, and building StudyHub was a way to solve a real problem for my academic community while practicing full-stack architecture end to end.",
      },
      dataset: {
        number: "04",
        title: "Data Model",
        content:
          "The Prisma schema models users, departments, courses, notes, career listings, and research papers. Six departments come pre-configured — CSE, SWE, English, EEE, Economics, and Data Science — each with a curated course catalog.",
      },
      dataProcessing: {
        number: "05",
        title: "Uploads & Course Creation",
        content:
          "Students can upload materials from their device or link external resources, with file-type validation for PDF, DOCX, PNG, and JPG. When uploading, they can pick an existing course or add a new one; new courses are automatically cataloged under the department for others to use.",
      },
      baseline: {
        number: "06",
        title: "Core Features",
        content:
          "The platform is organized into feature modules, each with its own routes on both client and server.",
        bullets: [
          "/study — notes repository with full-text search, filters, sorting, and ratings.",
          "/jobs — tuition, home tutoring, internships, and tech jobs.",
          "/research — academic preprints with DOI links.",
          "/network and /profile — student directory and academic portfolios.",
        ],
      },
      architecture: {
        number: "07",
        title: "System Architecture",
        content:
          "Next.js 14 client (App Router) communicates with an Express REST API via Axios. The API is organized into modules for auth, departments, notes, admin, and stats, and persists data through Prisma ORM to PostgreSQL, with an in-memory fallback store for offline development.",
      },
      methodology: {
        number: "08",
        title: "Authentication & Roles",
        content:
          "Users sign up and log in through JWT-based authentication with bcrypt password hashing. Admin features are restricted to admin-role accounts or a passkey gateway, separating regular students from content administrators.",
      },
      experiments: {
        number: "09",
        title: "Admin Management Hub",
        content:
          "The /admin hub lets administrators add and delete departments, register official courses, post and remove job and tuition listings, and publish research papers with DOI and author metadata.",
      },
      evaluation: {
        number: "10",
        title: "API Design",
        content:
          "REST endpoints cover departments and courses (GET/POST/DELETE /api/departments, POST /api/departments/courses), notes (GET/POST /api/notes, POST /api/notes/upload), authentication (/api/auth/signup, /api/auth/login), and admin operations (/api/admin/overview, /careers, /research).",
      },
      errorAnalysis: {
        number: "11",
        title: "Resilience",
        content:
          "If PostgreSQL is unavailable during development, the server falls back to an in-memory store so the frontend remains usable. File uploads are validated by type before being accepted.",
      },
      engineeringDecisions: {
        number: "12",
        title: "Key Engineering Decisions",
        content:
          "PostgreSQL with Prisma ORM provides relational integrity between departments, courses, and notes with type-safe queries. Security middleware — Helmet, express-rate-limit, and bcrypt — protects the API, and Multer handles multipart uploads.",
      },
      challenges: {
        number: "13",
        title: "Challenges",
        content:
          "Designing a schema flexible enough for user-created courses while keeping catalogs consistent, coordinating a separately deployed frontend and backend, and handling secure file uploads.",
      },
      deployment: {
        number: "14",
        title: "Deployment Plan",
        content:
          "The repository documents deploying the backend to a Node host such as Render or Railway (npm install && npx prisma generate; node server.js) and the frontend to Vercel with the client folder as the root directory.",
      },
      limitations: {
        number: "15",
        title: "Current Limitations",
        content:
          "There is no public live deployment linked yet, and features such as notifications, moderation workflows, and AI-assisted search are not implemented.",
      },
      futureWork: {
        number: "16",
        title: "Future Work",
        content:
          "Deploy publicly, add moderation and notifications, and explore semantic search and a RAG-based study assistant over uploaded course materials.",
      },
      links: {
        github: "https://github.com/anikdey095/Studyhub",
      },
    },
  },
  "bangladesh-driving-assistance": {
    projectId: "bangladesh-driving-assistance",
    slug: "bangladesh-driving-assistance",
    title: "AI-Based Intelligent Driving Assistance for Bangladesh's Unstructured Roads",
    subtitle:
      "A research direction on perception for non-lane traffic, pavement hazards, and pedestrian safety in Bangladesh.",
    sections: {
      overview: {
        number: "01",
        title: "Overview",
        content:
          "This entry documents a research direction rather than a finished project: designing low-cost visual perception that can work on unstructured roads in South Asia. Widely used autonomous driving datasets (KITTI, Waymo, nuScenes) assume clear lane markings, standard vehicle types, and orderly pedestrian behavior, while Bangladeshi roads feature mixed non-motorized traffic, unpredictable crossings, and frequent surface damage.",
        bullets: [
          "Status: research direction — no implementation or results are claimed.",
          "Identifies the gap between Western driving benchmarks and South Asian road conditions.",
          "Outlines a possible multi-task edge perception approach.",
        ],
      },
      problem: {
        number: "02",
        title: "Problem Statement",
        content:
          "Road traffic accidents are a serious public-safety problem in Bangladesh. Driver-assistance features that rely on lane-keeping heuristics and conventional vehicle priors are poorly suited to roads without lane discipline.",
      },
      motivation: {
        number: "03",
        title: "Motivation",
        content:
          "I am interested in applying AI to local, high-impact problems. This direction explores how deep learning perception could run on affordable hardware to support road safety.",
      },
      dataset: {
        number: "04",
        title: "Proposed Data Taxonomy",
        content:
          "A localized taxonomy would need to cover: (1) local vehicles such as rickshaws, CNG auto-rickshaws, and trucks; (2) road anomalies such as potholes and unpaved shoulders; and (3) dynamic actors such as pedestrians and livestock.",
      },
      dataProcessing: {
        number: "05",
        title: "Environmental Challenges",
        content:
          "Monsoon rain, glare, dust, poor night lighting, and camera shake on rough roads would all need to be addressed, for example through contrast enhancement and robust augmentation.",
      },
      baseline: {
        number: "06",
        title: "Expected Baseline Limitations",
        content:
          "Detectors trained on MS-COCO have no dedicated classes for rickshaws or potholes, so off-the-shelf models are expected to misclassify local vehicles and miss surface hazards — a hypothesis to be tested.",
      },
      architecture: {
        number: "07",
        title: "Proposed Architecture",
        content:
          "One possible design is a shared lightweight backbone with two heads: an object detection head for vehicles and pedestrians, and a segmentation head for drivable area and potholes.",
      },
      methodology: {
        number: "08",
        title: "Possible Methodology",
        content:
          "Candidate approaches include fine-tuning YOLO-family detectors on locally collected footage, semi-supervised labeling to reduce annotation cost, and estimating collision risk from bounding-box growth rather than expensive depth sensors.",
      },
      experiments: {
        number: "09",
        title: "Planned Experiments",
        content:
          "Future work would evaluate detection and segmentation quality on dashcam footage from Bangladeshi roads and measure inference latency on edge hardware.",
      },
      evaluation: {
        number: "10",
        title: "Target Metrics",
        content:
          "Mean Average Precision (mAP) for detection, Intersection-over-Union (IoU) for hazard segmentation, and frame latency on edge devices.",
      },
      errorAnalysis: {
        number: "11",
        title: "Anticipated Error Modes",
        content:
          "Heavy occlusion in dense traffic and adverse weather are expected to be the hardest cases for monocular perception.",
      },
      engineeringDecisions: {
        number: "12",
        title: "Hardware Considerations",
        content:
          "Targeting low-cost edge devices would require lightweight backbones and model optimization such as quantization.",
      },
      challenges: {
        number: "13",
        title: "Key Research Challenges",
        content:
          "Collecting and annotating diverse video across seasons, lighting, and road types is the main prerequisite for any empirical work.",
      },
      deployment: {
        number: "14",
        title: "Envisioned Deployment",
        content:
          "An aftermarket monocular dashcam module providing visual and audio warnings to drivers.",
      },
      limitations: {
        number: "15",
        title: "Current Status & Boundaries",
        content:
          "This is a conceptual research direction. No dataset, trained model, or experimental results exist yet, and no claim of a working system is made.",
      },
      futureWork: {
        number: "16",
        title: "Future Academic Trajectory",
        content:
          "A potential thesis or graduate research topic in computer vision and intelligent transportation systems.",
      },
      links: {},
    },
  },
  "personal-portfolio": {
    projectId: "personal-portfolio",
    slug: "personal-portfolio",
    title: "My Portfolio: Personal Developer & AI/ML Portfolio",
    subtitle:
      "Architecture & engineering write-up for building an authentic AI/ML portfolio with Next.js App Router, Three.js, interactive AI simulators, and a dynamic Admin Studio.",
    sections: {
      overview: {
        number: "01",
        title: "Overview",
        content:
          "This portfolio presents my Computer Science background, verified machine learning and deep learning projects, research directions, and interactive AI simulators inside a clean, dark-navy Next.js web application.",
      },
      problem: {
        number: "02",
        title: "Problem Statement",
        content:
          "Standard template portfolios rarely highlight problem formulation, honest model limitations, or reproducible architectures—leaving recruiters and professors with screenshots instead of engineering substance.",
      },
      motivation: {
        number: "03",
        title: "Motivation",
        content:
          "Starting from my earlier Vite + React portfolio (`anikdey095/portfolio-main`), I wanted a unified home that pairs genuine storytelling with structured case studies, interactive ML visualizations, and verified links to live deployments.",
      },
      dataset: {
        number: "04",
        title: "Structured Content Schema",
        content:
          "All portfolio entities—profile metadata, projects, deep-dive case studies, learning timeline milestones, technical skills, and research ideas—follow strictly typed TypeScript interfaces synced with a JSON state store (`src/data/content.json`).",
      },
      dataProcessing: {
        number: "05",
        title: "Dynamic Storage & Message Capture",
        content:
          "API route handlers (`/api/data`, `/api/admin`, `/api/contact`) validate incoming payloads, sanitize tags and slugs, and read/write structured JSON records without requiring an external database server during local development.",
      },
      baseline: {
        number: "06",
        title: "Starting Point (Vite Portfolio v1)",
        content:
          "The original Vite + React version featured static pages with dark/light theme support. Upgrading to Next.js App Router added server-rendered dynamic routes (`/projects/[slug]`), SEO sitemap generation, and backend API route handlers.",
      },
      architecture: {
        number: "07",
        title: "System Architecture",
        content:
          "Client components (Hero, interactive Playground simulators, Contact form, Admin Studio) communicate with Next.js Route Handlers backed by TypeScript data modules and `src/data/content.json`.",
      },
      methodology: {
        number: "08",
        title: "Design & Engineering Approach",
        content:
          "Adopted a calm deep-navy editorial layout (`#060b14`) with focused sky-cyan accents (`#0ea5e9`), responsive Flexbox/Grid sections, and three educational client-side simulators (embeddings, RAG retrieval, and vision thresholds).",
      },
      experiments: {
        number: "09",
        title: "Visual & Usability Refinements",
        content:
          "Iterated on particle density and hero typography—reducing Three.js constellation node counts (`34` nodes) and moving interactive simulators to `/playground` so the homepage stays readable and fast.",
      },
      evaluation: {
        number: "10",
        title: "Verification Checks",
        content:
          "Validated via strict TypeScript checking (`npx tsc --noEmit`), Next.js route type generation (`npx next typegen`), and live HTTP `200` verification across all static and dynamic routes.",
      },
      errorAnalysis: {
        number: "11",
        title: "Failure Modes Handled",
        content:
          "Handled stale `.next/types` route caches after route changes, missing external email provider keys in `/api/contact` via inbox persistence + Gmail Web compose fallback, and empty `content.json` arrays.",
      },
      engineeringDecisions: {
        number: "12",
        title: "Key Engineering Decisions",
        content:
          "Lazy-loaded the Three.js WebGL canvas with `next/dynamic` (`ssr: false`) and a lightweight SVG fallback so initial page hydration stays smooth even on mobile or low-GPU devices.",
      },
      challenges: {
        number: "13",
        title: "Challenges",
        content:
          "Balancing rich interactive visualizations (3D constellation, live vector similarity sliders) with genuine human warmth—replacing generic dashboard widgets with honest first-person project narratives.",
      },
      deployment: {
        number: "14",
        title: "Deployment & Delivery",
        content:
          "Runs cleanly on Next.js 16 with App Router and supports serverless platforms like Vercel; local JSON persistence can be paired with Web3Forms or a cloud database when deployed to read-only filesystems.",
      },
      limitations: {
        number: "15",
        title: "Current Limitations",
        content:
          "Because `src/data/content.json` writes to the local filesystem, admin edits and contact inbox persistence work best locally or on writable servers until connected to a hosted DB (e.g. PostgreSQL / Supabase).",
      },
      futureWork: {
        number: "16",
        title: "Future Work",
        content:
          "Add optional password/session authentication in front of `/admin` before public deployment and connect PostgreSQL or Resend/Web3Forms environment variables in production.",
      },
      links: {
        github: "https://github.com/anikdey095/portfolio-main",
      },
    },
  },
};
