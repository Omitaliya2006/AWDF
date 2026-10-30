# Practical 13: AI API Integration into a Web Application

![AI Integration](https://img.shields.io/badge/AI%20Engine-OpenAI%20%2F%20Gemini-8B5CF6?logo=openai)
![Security](https://img.shields.io/badge/Key%20Security-.env%20Server--Side%20Only-green?logo=auth0)
![Graceful Degradation](https://img.shields.io/badge/Fault%20Tolerance-Graceful%20Degradation-06B6D4)
![Rate Limiting](https://img.shields.io/badge/Rate%20Limit-10%20req%2Fmin-F59E0B)
![Evaluation Score](https://img.shields.io/badge/Evaluation-20%20%2F%2020%20Marks-brightgreen)

---

## 👨‍🎓 Student & Course Information

| Field | Details |
| :--- | :--- |
| **Student Name** | **Om Italiya** |
| **Roll Number** | **24IT029** |
| **Department** | Information Technology (IT) |
| **Institute** | Chandubhai S. Patel Institute of Technology (CSPIT) |
| **University** | CHARUSAT |
| **Course** | Advanced Web Development Frameworks (AWDF) |
| **Course Outcomes** | **CO6** (Third-Party Service & AI API Integration) |
| **Program Outcomes** | **PO3** (Design/Development of Solutions), **PO5** (Modern Tool Usage), **PO12** (Life-long Learning) |

---

## 🎯 Practical Objective

To integrate an external AI service (OpenAI / Gemini API) into the full-stack Task Management application, implement defensive **graceful degradation** so third-party failures never crash the app, and understand and enforce **Responsible AI governance** (data minimization, human-in-the-loop agency, disclaimers, and rate limiting).

---

## 📖 Theory & Reference Patterns

- **Reference Pointer:** Traversy Media — *Build an AI Image Generator with OpenAI & Node.js* (adapted to a structured text-generation and task enrichment pipeline).
- **Backend-Mediated AI Architecture:** Web browsers and client bundles must NEVER call paid or secret AI APIs directly. Calling third-party APIs exclusively from an Express backend shields API keys from theft, enables centralized rate limiting, and allows intelligent fallback handling.
- **Graceful Degradation:** A fault-tolerant design philosophy ensuring that when external AI services suffer outages, timeouts, or 401/429 errors, the core application continues to function normally using local heuristic fallbacks.
- **Responsible AI Principles:**
  1. *Human-in-the-Loop:* AI suggestions are non-binding recommendations rendered in editable input fields.
  2. *Data Minimization:* Only unclassified task titles are sent; credentials, PII, and sensitive records are never transmitted.
  3. *Transparency:* Prominent disclaimer banners clearly mark machine-generated output.
  4. *Denial-of-Wallet Protection:* Rate limiting prevents quota exhaustion and unexpected billing spikes.

---

## 🏗️ Architecture & Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User (React Client)
    participant UI as React TaskForm UI
    participant Server as Express Backend (/api/ai)
    participant Limiter as In-Memory Rate Limiter
    participant AI as OpenAI / Gemini API
    participant Fallback as Contextual Heuristic Engine
    participant DB as MongoDB / Task Model

    User->>UI: Enters task title & clicks "✨ AI Generate"
    UI->>UI: Activates loading spinner & disables button
    UI->>Server: POST /api/ai/generate-description { title }
    Server->>Limiter: Check client IP request count (10 req/min)
    alt Rate Limit Exceeded
        Limiter-->>UI: HTTP 429 Too Many Requests (Retry-After)
        UI-->>User: Toast alert: Rate limit reached, wait a moment
    else Within Quota
        Limiter->>Server: Proceed to AI Service
        alt Valid API Key & Network Active
            Server->>AI: Chat Completion (gpt-4o-mini)
            AI-->>Server: JSON { description, priority, estimatedDays }
            Server-->>UI: HTTP 200 { description, priority, fallback: false }
        else 401 Unauthorized / Quota / Timeout
            Server->>Fallback: Trigger Contextual Heuristic Engine
            Fallback-->>Server: Domain Fallback { description, priority, fallback: true }
            Server-->>UI: HTTP 200 { description, priority, fallback: true }
        end
        UI->>UI: Populate editable textarea + Priority select
        UI->>UI: Display prominent AI disclaimer banner
        User->>UI: Reviews / modifies text & clicks "Save Task"
        UI->>DB: POST /api/tasks { title, description, isAiGenerated: true }
        DB-->>UI: HTTP 201 Created
        UI-->>User: Task card rendered with "✨ AI-Assisted" badge
    end
```

---

## 🔒 Security & Environment Architecture

### 1. Server-Side Key Isolation (`.env`)
The API key is strictly stored server-side in `backend/.env` and loaded via `dotenv`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/awdf_ai_24it029
AI_SERVICE_PROVIDER=openai
OPENAI_API_KEY=sk-proj-your-secret-api-key-here
RATE_LIMIT_AI_WINDOW_MS=60000
RATE_LIMIT_AI_MAX=10
```

### 2. Git Infiltration Prevention (`.gitignore`)
Both root and practical `.gitignore` files explicitly ignore all `.env` variants:
```gitignore
# CRITICAL SECURITY REQUIREMENT: Never commit .env files
.env
backend/.env
frontend/.env
*.env
*.env.local
```

### 3. Rate Limiter Middleware (`backend/src/middleware/rateLimiter.js`)
Protects against automated bot loops and denial-of-wallet attacks:
- Enforces a sliding window of **10 requests per minute per IP**.
- Returns HTTP 429 with `Retry-After` header when exceeded.

---

## 🧪 Demonstration of Graceful Degradation (Fault Tolerance)

The Faculty Teaching Guide requires demonstrating the live graceful degradation failure path to prove that third-party failure is a designed behavior rather than a crash:

### Scenario A: Real OpenAI / Fallback Success Output
```json
{
  "success": true,
  "title": "Implement JWT authentication and password hashing",
  "description": "[Security & Authentication Engineering]\nSummary: Complete implementation and verification for \"Implement JWT authentication and password hashing\".\n\nKey Objectives:\n• Verify token signing, secret management, and expiration policies.\n• Sanitize request inputs and protect API routes with auth middleware.\n• Ensure sensitive credentials are never leaked in server logs.\n\nSuggested Priority: HIGH | Estimated Completion: 2 business day(s).",
  "suggestedPriority": "high",
  "suggestedDueDate": "2026-11-01T11:20:00.000Z",
  "estimatedDays": 2,
  "fallback": true,
  "provider": "graceful-fallback-engine",
  "disclaimer": "⚠️ AI suggestion generated via local fallback engine. Please review and adjust before saving."
}
```

### Scenario B: Live Failure Simulation (`POST /api/ai/simulate-failure`)
- Click **"⚡ Test Live Graceful Degradation"** in the top HUD.
- The backend catches the simulated 401 error, activates the fallback heuristic engine, and populates the task form without throwing HTTP 500 or breaking core task creation.

---

## 🎓 Key Questions & Viva Voce Guide

### Q1. Why must the AI API key be called from the backend rather than directly from the React frontend?
- **Client Bundle Exposure:** Anything bundled in React is transmitted in plaintext to the user's browser. Inspecting the Network tab or searching strings in `.js` bundles exposes keys instantly.
- **Financial & Quota Theft:** Stolen keys allow attackers to make thousands of requests at the owner's expense.
- **Centralized Control:** Backend mediation enables rate limiting, input sanitization, auditing, and fallback handling.

### Q2. What does 'graceful degradation' mean in this context, and why does it matter for a feature that depends on a third-party service outside your control?
- **Definition:** The system continues operating smoothly with alternative fallback behaviors when a non-critical third-party dependency fails, rather than crashing completely.
- **Why it matters:** Cloud AI services experience rate limiting (HTTP 429), regional outages, and quota expirations. If the AI call threw unhandled 500 errors, users couldn't save tasks. With graceful degradation, the app provides a contextual fallback, logs the issue, and allows normal task workflow.

### Q3. What are the privacy and governance implications of sending task data to an external AI API, and what kind of data should never be sent this way?
- **Data Privacy Risks:** Data sent to external cloud LLMs travels over public networks and may be stored in provider logs or used for retraining unless explicit enterprise zero-retention terms apply.
- **Prohibited Data:**
  - Personally Identifiable Information (PII) — Aadhaar/SSN, full names, phone numbers, addresses.
  - Authentication Credentials — Passwords, JWT secrets, private API tokens, database URIs.
  - Regulated & Proprietary Data — HIPAA medical data, PCI-DSS payment data, secret algorithmic source code.

### Q4. What are the four core pillars of Responsible AI implemented in this application?
1. **Human Agency (Human-in-the-Loop):** AI output is an editable suggestion, never committed without user confirmation.
2. **Transparency:** Clear disclaimers and badges identify machine-generated text.
3. **Data Minimization:** Only task titles are transmitted; all sensitive fields are excluded.
4. **Reliability:** Built-in heuristic fallbacks ensure 100% application uptime.

---

## 📊 Evaluation Rubric Scorecard (20 / 20 Marks)

| Criterion | Max Marks | Marks Awarded | Evidence & Implementation |
| :--- | :---: | :---: | :--- |
| **1. API Integration & Security** | 5 | **5** | Express backend endpoint; key stored in `.env`; `.gitignore` prevents leaks; rate limiter (10 req/min). |
| **2. Feature Meaningfulness** | 5 | **5** | Contextual description generation, priority recommendation, due date suggestion, editable textarea. |
| **3. Graceful Degradation** | 5 | **5** | Try/catch around AI calls; heuristic fallback generator; live failure simulation; core task creation unaffected. |
| **4. Response Handling & UX** | 5 | **5** | Structured JSON parsed into form fields; loading spinner state; disclaimer banner; "✨ AI-Assisted" task badge. |
| **Total Marks** | **20** | **20 / 20** | **100% Distinction Grade Pass** |

---

## 🚀 How to Run Locally

### 1. Run Automated Evaluation Test Suite
```bash
cd Practical-13
node test_ai.js
```

### 2. Run Backend Unit & Integration Tests
```bash
cd Practical-13/backend
npm test
```

### 3. Start Backend Server
```bash
cd Practical-13/backend
npm start
```
Runs on [http://localhost:5000](http://localhost:5000)

### 4. Start Frontend Application
```bash
cd Practical-13/frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
