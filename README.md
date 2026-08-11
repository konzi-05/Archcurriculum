# B.Tech Information Technology Curriculum Recommender & Career Pathways Engine

An enterprise-grade B.Tech Information Technology curriculum planning and elective recommendation engine built according to **AICTE and IEEE/ACM Computer Science & IT Model Curriculum standards**.

It combines a **multi-factor hybrid recommendation algorithm** (Prerequisite Directed Acyclic Graph validation, TF-IDF skill vector cosine alignment, credit load balancing, and constraint satisfaction) with **server-side Gemini 3.6 Flash AI** to provide personalized academic guidance, skill gap analytics, and industry role preparation.

---

## 🌟 Key Features

### 1. AICTE B.Tech IT Model Curriculum Dataset
- Complete **8-Semester (4-Year) Curriculum Map** featuring 40+ subjects across core domains:
  - *Math & Foundational CS* (Calculus, Probability, Discrete Math, Formal Languages)
  - *Software Engineering* (Data Structures, Algorithms, OOP Java, Web Engineering, Compiler Design)
  - *AI & Data Science* (Python Data Science, Machine Learning, Deep Learning, NLP & LLMs, Computer Vision)
  - *Cloud & Systems* (Operating Systems, Virtualization, DevOps & CI/CD, Distributed Systems)
  - *Cybersecurity & Networks* (Computer Networks, Cryptography, Ethical Hacking, Digital Forensics)
  - *Hardware & Embedded* (Digital Logic, Computer Architecture, IoT & Edge Computing)

### 2. Standout Algorithmic Recommendation Logic
- **DAG Topological Prerequisite Engine**: Automatically verifies completed course transcripts against dependency graphs to guarantee prerequisite readiness before elective enrollment.
- **Skill Vector Cosine Alignment**: Maps student target career roles (e.g. *AI/ML Engineer*, *Full Stack Architect*, *Cloud & DevOps Engineer*, *Cybersecurity Specialist*, *Data Engineer*) against course learning outcomes.
- **Workload Constraint Balancer**: Optimizes credit load per semester (18-24 credits) and balances theory vs practical lab workload hours.
- **Skill Gap Matrix Calculation**: Quantifies competency gaps between current student skill levels and target role benchmarks.

### 3. Server-Side Gemini AI Integration (`gemini-3.6-flash`)
- **Executive Career Readiness Analysis**: Generates structured JSON insights detailing semester execution strategies, actionable steps, and market trend forecasts.
- **Interactive AI Academic Counselor**: Chat live with an AI Dean for instant course selection advice, capstone project ideas, and industry certification guidance.

### 4. Production-Ready Full-Stack Architecture
- **Express Backend on Port 3000** with Vite middleware during development and `esbuild` CommonJS bundle output (`dist/server.cjs`) in production.
- **Export Academic Plan**: One-click download of customized Markdown (.md) curriculum reports.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts (Radar & Competency Analytics), Motion.
- **Backend**: Express.js, `@google/genai` (Gemini 3.6 Flash), TypeScript `tsx`.
- **Build System**: Vite, `esbuild` (Bundles server to CommonJS `dist/server.cjs`).

---

## 🚀 Local Development & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or verify `.env`:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

---

## 📦 Production Build & Render / GitHub Deployment

### Build Command
```bash
npm run build
```
This runs Vite client build and bundles `server.ts` into `dist/server.cjs` via `esbuild`.

### Start Command
```bash
npm start
```

### Render.com Deployment Configuration
Set up a Web Service on Render with the following configuration:
- **Environment**: Node
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini Key)*

---

## 📁 Repository Structure

```
├── server.ts                       # Express backend server & Gemini API routes
├── src/
│   ├── main.tsx                    # React client entry point
│   ├── App.tsx                     # Main layout & state orchestrator
│   ├── types/
│   │   └── curriculum.ts           # TypeScript interfaces for courses, career tracks, and recommendations
│   ├── data/
│   │   └── btechItCurriculum.ts    # 8-Semester B.Tech IT Course Catalog & Career Tracks dataset
│   ├── services/
│   │   └── recommendationEngine.ts # DAG prerequisite & multi-factor mathematical scoring engine
│   └── components/
│       ├── Header.tsx              # Top navigation bar
│       ├── ProfileSetup.tsx        # Transcript checklist & career track editor
│       ├── RecommendationDashboard.tsx # Ranked elective cards & match score breakdown
│       ├── CurriculumMap.tsx       # 8-Semester DAG course map & domain filters
│       ├── CareerPathwayMatrix.tsx # Recharts radar chart & skill gap matrix
│       ├── SemesterPlanner.tsx     # Interactive semester course builder & credit balancer
│       ├── SyllabusModal.tsx       # Course syllabus drawer
│       ├── AiCounselorModal.tsx    # Live Gemini AI Counselor Q&A dialog
│       └── GithubDeploymentModal.tsx # Copyable Render/Docker deployment guide
├── package.json                    # Full-stack build scripts and dependencies
├── metadata.json                   # Applet metadata
└── README.md                       # Comprehensive documentation
```

---

*Compliant with AICTE and IEEE/ACM Computer Science & IT Model Curricula.*
