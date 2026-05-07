# HireIQ

**Recruiter intelligence infrastructure for Bharat.**

HireIQ conducts AI-powered voice interviews in English, Hindi, and Hinglish, then converts each conversation into a structured recruiter intelligence report with evidence-backed scoring, risk detection, and a clear hiring recommendation.

Recruiters stop taking notes. They start making decisions.

---

## The Problem

First-round screening in India is expensive and inconsistent. A recruiter handles 50-200 candidates per role. Each call takes 20-30 minutes. The output is memory, a few notes, and a gut feeling.

Candidates who interview in Hindi or Hinglish are evaluated less consistently than those who interview in English. Structured evaluation rarely survives the phone call.

---

## What HireIQ Does

1. A recruiter starts an AI voice interview from the cockpit
2. The system conducts a structured phone screen in the candidate's preferred language
3. The transcript is analyzed automatically after the call
4. A structured intelligence report appears: scored, evidence-backed, and recruiter-ready
5. The recruiter reads the verdict, reviews the evidence, and decides

The AI does not make the hire. It makes the decision easier.

---

## Why This Matters for Bharat

Most AI hiring tools assume English-first candidates and English-first recruiters. India does not work that way.

HireIQ analyzes interviews in **English, Hindi, and Hinglish**. Candidates are scored on the quality of their answers, not the fluency of their English.

Recruiters get the same structured output regardless of which language the interview happened in.

---

## Intelligence Report

Every completed interview generates a structured report:

| Field | What It Contains |
| --- | --- |
| Overall Score | Weighted composite 0-100 |
| Recommendation | Advance / Review / Reject |
| Confidence | How reliable the analysis is |
| Dimension Scores | Role fit, communication, experience, intent, problem solving |
| Strengths | What the candidate demonstrated |
| Risks | What should give the recruiter pause |
| Evidence | Direct quotes from the transcript, verified to exist |
| Extracted Facts | Years of experience, location, notice period, salary expectation |
| Follow-up Questions | What to ask in the next round |
| Recruiter Summary | 2-3 sentence plain-English verdict |

Scores are computed deterministically in code, not trusted directly from the LLM. Recommendations are derived from the weighted score, not from the model's opinion.

---

## What Makes It Different

**Evidence verification.**  
Every evidence quote is checked against the actual transcript before being included in the report. Hallucinated evidence is removed silently. The recruiter only sees what the candidate actually said.

**Deterministic scoring.**  
The LLM scores five dimensions. HireIQ computes the weighted overall score using role-specific rubrics. The recommendation threshold is a hard rule, not an LLM suggestion.

**Graceful degradation.**  
If analysis fails, the system writes a structured fallback report with a manual review flag. The webhook does not fail the recruiter workflow. The recruiter still sees a result.

**Role-aware evaluation.**  
Software Engineer, Operations, and Sales/HR interviews use different scoring weights and evaluation rubrics. A communication score carries more weight in a Sales/HR interview than in a backend engineering screen.

**Recruiter-in-control design.**  
Every report includes a confidence score, evidence count, and advisory disclaimer. The system augments recruiter judgment. It does not replace it.

---

## Tech Stack

| Layer | Technology | Why |
| --- | --- | --- |
| Voice interviews | Bolna | Outbound AI voice calls with multilingual support |
| Intelligence | Groq, llama-3.1-8b-instant | Fast structured JSON output |
| Backend | Node.js + Express | Minimal, auditable API surface |
| Database | SQLite | Zero-config, persistent, demo-reliable |
| Frontend | React + Vite | Fast recruiter cockpit without framework overhead |

---

## Architecture

```text
Recruiter starts interview
        |
Bolna conducts voice call
        |
Webhook arrives with transcript
        |
Transcript normalization
        |
Role strategy selection
        |
Groq analysis with strict JSON schema
        |
Evidence verification
        |
Deterministic score computation
        |
Report written to SQLite
        |
React cockpit auto-refreshes
```

The backend normalizes array, string, null, and mixed-language transcript payloads. Candidate scores and recommendations are mirrored for fast pipeline reads.

---

## Running Locally

**Prerequisites:** Node.js 20+, a Bolna account, and a Groq API key for live screening.

```bash
# Server
cd server
npm install
npm start
```

```bash
# Client
cd client
npm install
npm run dev
```

For local development, run the API and client in separate terminals using the commands above.

SQLite initializes and seeds automatically on server start.

---

## Environment Variables

```text
server/.env
BOLNA_API_KEY=your Bolna API key
BOLNA_AGENT_ID=your Bolna agent ID
GROQ_API_KEY=your Groq API key
PORT=3001

client/.env
# The deployed hackathon demo is static and does not require a client API URL.
```

The seeded demo data can run without external credentials. Live outbound interviews require provider configuration.

---

## Demo Candidates

The system seeds six candidates that tell a recruiter story:

| Candidate | Role | Score | Story |
| --- | --- | --- | --- |
| Aisha Khan | Operations | 82 | Strong fit, Hinglish interview, advance |
| Priya Sharma | Software Engineer | 67 | Solid communication, limited backend depth |
| Vikram Nair | Software Engineer | 58 | Technically strong, compensation blocker |
| Rahul Verma | Sales/HR | 41 | Low communication clarity, Hindi interview |
| Sneha Patel | Operations | Pending | Awaiting first interview |
| Arjun Mehta | Sales/HR | Failed | Call failed, retry needed |

---

## Engineering Tradeoffs

**SQLite over Postgres.**  
Eliminates network dependency for demo reliability. A managed database would be the right production choice.

**Synchronous analysis in webhook.**  
Analysis runs inline after the webhook arrives. Groq responds quickly enough for the current polling cycle. A production system would use a job queue.

**No authentication.**  
Out of scope for this prototype. A production system would have role-based access for recruiters and hiring managers.

**Single Bolna agent.**  
The prototype uses one agent for all roles. Production would use role-specific agents with tailored question sets and follow-up logic.

---

## What Would Come Next

- Role-specific Bolna agents with adaptive question flows
- ATS integration with Greenhouse, Lever, or other recruiter systems
- Recruiter feedback loop to improve rubrics
- Expanded language support for Tamil, Telugu, and Bengali
- Hiring manager view for read-only decision review
- Candidate and recruiter notifications around interview status

---

## Built For

**AI for Bharat - HackerEarth Hackathon**

Theme: AI for recruitment infrastructure in the Indian context.

---

*HireIQ Intelligence is advisory. All hiring decisions remain with your team.*
