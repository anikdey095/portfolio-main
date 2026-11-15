# Anik Dey — AI/ML Engineer Portfolio

Personal portfolio of **Anik Dey**, an Aspiring AI/ML Engineer and Computer Science & Engineering undergraduate at **Metropolitan University, Sylhet, Bangladesh** (expected graduation: December 2026).

This portfolio highlights end-to-end Machine Learning, Deep Learning, NLP, Computer Vision, and Retrieval-Augmented Generation (RAG) projects, engineering case studies, interactive AI concept simulators, a research agenda, direct Gmail contact delivery, and a cookie-authenticated private Admin Studio.

- **GitHub:** [github.com/anikdey095](https://github.com/anikdey095)
- **LinkedIn:** [linkedin.com/in/anik-dey-7723a4329](https://www.linkedin.com/in/anik-dey-7723a4329/)
- **Email:** [anikd1452@gmail.com](mailto:anikd1452@gmail.com)
- **Resume:** [public/resume.pdf](./public/resume.pdf) (`/resume.pdf`)

---

## Key Features

- **Human-Centered Portfolio Design:** Dark navy (`#060b14`) & sky-blue (`#0ea5e9`) aesthetic with dark/light theme support, subtle Three.js WebGL constellation background, and clean editorial layout.
- **Personal Story & Benchmarks:** First-person CSE background, verified project metrics, categorized technical skills, and a chronological learning journey.
- **Engineering Case Studies (`/projects/[slug]`):** Dedicated write-ups for each project covering the problem statement, modeling/engineering approach, system architecture, metrics, challenges, and lessons learned.
- **Interactive AI Playground:** Client-side simulators for exploring vector **Embedding Space**, **RAG Chunking Pipelines**, and **Computer Vision Bounding-Box Confidence**.
- **Research Agenda (`/research`):** Honest formulation of applied AI research directions separating problem framing from empirical claims.
- **Direct Gmail Contact Integration & Inbox (`/api/contact`):**
  - Integrates [Web3Forms](https://web3forms.com/) on the server using `process.env.WEB3FORMS_ACCESS_KEY` (never exposed to the browser) to forward visitor inquiries to `anikd1452@gmail.com`.
  - Validates and sanitizes inputs, enforces MongoDB-backed duplicate submission protection and per-IP rate limiting (`5` requests per `10` minutes), and persists all messages in MongoDB (`messages` collection).
  - Only reports email delivery success after confirmed Web3Forms delivery.
- **Secured Private Admin Studio (`/admin`, `/admin/login`):**
  - Protected on both the server route (`src/app/admin/page.tsx`) and API routes (`/api/admin`, `/api/admin/auth`, `/api/admin/analytics`) using HMAC-SHA256 signed HTTP-only, `SameSite=Strict` session cookies (`admin_session`).
  - Constant-time password verification (`crypto.timingSafeEqual` over SHA-256 digests) reading `ADMIN_PASSWORD` from environment variables.
  - Per-IP brute-force login protection (`5` failed attempts within `15` minutes trigger a `15`-minute `429` lockout).
  - Full MongoDB-backed CRUD across profile, metrics, projects (including `featuredOrder`, cover & gallery images), research cards, skills, learning journey, contact inbox, Cloudinary media/CV uploads, and Vercel Web Analytics dashboard.

---

## Featured Projects

| Project | Domain & Focus | Core Stack | Links |
| :--- | :--- | :--- | :--- |
| **CropPulse AI** | Random Forest crop recommender across 22 crop classes (99.55% test accuracy) with JSON tree fallback | Python, Scikit-learn, Random Forest, Pandas, Flask, JavaScript, Vercel | [GitHub](https://github.com/anikdey095/crop-recommendation) · [Live Demo](https://crop-recommendation-zeta.vercel.app) |
| **Moodline** | BiGRU 6-class emotion classifier (~90.1% test accuracy on `dair-ai/emotion`) served via async FastAPI | Python, TensorFlow, Keras, BiGRU/LSTM, Hugging Face Datasets, FastAPI, Docker, Render | [GitHub](https://github.com/anikdey095/Deep_Learning_Project_Sentiment_analysis) · [Live Demo](https://moodline-sentiment.onrender.com/) |
| **DocMind** | Multi-PDF Retrieval-Augmented Generation Q&A chatbot with conversation memory | Python, LangChain, FAISS, Sentence-Transformers, Llama 3.2, OpenAI GPT-3.5, Streamlit | [GitHub](https://github.com/anikdey095/Chat-with-Multiple-PDFs) |
| **FocusBell AI** | In-browser phone distraction detector & focus timer using webcam inference | React, Vite, TensorFlow.js, COCO-SSD, Tailwind CSS, Framer Motion, Vercel | [GitHub](https://github.com/anikdey095/mobile-detector) · [Live Demo](https://mobile-detector.vercel.app) |
| **StudyHub** | Full-stack academic collaboration portal for notes, courses, careers, and preprints | Next.js, TypeScript, React, Tailwind CSS, Node.js, Express, Prisma, PostgreSQL | [GitHub](https://github.com/anikdey095/Studyhub) |
| **Intelligent Driving Assistance** *(Research Direction)* | Problem formulation for non-lane traffic, potholes, and pedestrians on Bangladeshi roads | Python, PyTorch, YOLO, OpenCV, Edge AI | — |
| **Personal Portfolio** | Interactive developer & AI/ML portfolio with 3 AI simulators and Admin Studio | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Three.js, Framer Motion | [GitHub](https://github.com/anikdey095/portfolio-main) |

---

## Tech Stack

- **Framework & UI:** Next.js `16.3.5` (App Router), React `19.2.8`, TypeScript `^5`, Tailwind CSS `^4`
- **3D & Motion:** Three.js `^0.186.0`, Framer Motion `^13.2.0`, Lucide React `^1.45.0`
- **Backend & Security:** Next.js Route Handlers, Node.js `crypto` (HMAC-SHA256 & `timingSafeEqual`), `fs/promises` JSON/module sync, HTTP-only `SameSite=Strict` cookies
- **Email Delivery:** Web3Forms REST API

---

## Project Structure

```text
├── public/                 # Static assets (profile.jpg portrait, resume.pdf)
├── src/
│   ├── app/                # Next.js App Router pages & API routes (/admin, /admin/login, /api/*, /projects/[slug], /research)
│   ├── components/         # UI sections, layout, 3D Hero, AI Playground simulators & AdminDashboardClient
│   ├── data/               # JSON content store (content.json) synced with typed TypeScript modules
│   ├── lib/adminAuth.ts    # Constant-time auth, HMAC session tokens, cookie helpers & login rate limiting
│   └── types/portfolio.ts  # Shared TypeScript interfaces for portfolio entities
├── AGENTS.md               # Next.js 16 agent rules
└── package.json
```

---

## Local Development

### 1. Install dependencies & run the server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Additional scripts:

```bash
npm run build   # Build production bundle
npm start       # Start production server
npm run lint    # Run ESLint
```

### 2. Configure `.env.local`

Copy `.env.example` to `.env.local` in the project root (already ignored by `.gitignore` via `.env*` — **never commit real secrets**):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority
ADMIN_PASSWORD=your_strong_admin_password
ADMIN_SESSION_SECRET=your_random_64_hex_session_secret
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
VERCEL_API_TOKEN=your_vercel_api_token
VERCEL_PROJECT_ID=prj_your_vercel_project_id
VERCEL_TEAM_ID=
```

- Generate `ADMIN_SESSION_SECRET` with a cryptographically random 32-byte hex string (for example: `openssl rand -hex 32`).
- Configure **Cloudinary** (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) for serverless-compatible avatar, resume PDF, and project image uploads.
- Configure **Vercel Web Analytics** (`VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, optional `VERCEL_TEAM_ID`) to populate the Admin Analytics dashboard.

---

## Deploying to Vercel

1. Ensure **MongoDB Atlas → Security → Network Access** allows Vercel serverless outbound connections (`0.0.0.0/0`).
2. Push the repository to GitHub (verify `.env.local` is untracked).
3. Import the project in **Vercel** and add the following **Environment Variables** in **Project Settings → Environment Variables**:
   - `MONGODB_URI`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `WEB3FORMS_ACCESS_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `VERCEL_API_TOKEN` *(optional — for Admin Analytics)*
   - `VERCEL_PROJECT_ID` *(optional — for Admin Analytics)*
   - `VERCEL_TEAM_ID` *(optional — if under a Vercel Team)*
4. Enable **Web Analytics** in your Vercel Project Dashboard and deploy. All Admin edits (profile, projects, research, skills, journey, Cloudinary media, and contact inbox) persist directly in MongoDB Atlas and Cloudinary without requiring redeployment.
