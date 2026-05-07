import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";

const schemaSql = readFileSync(new URL("../schema.sql", import.meta.url), "utf8");
const databasePath = fileURLToPath(new URL("../hiring.db", import.meta.url));

export const db = new sqlite3.Database(databasePath);

function exec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

// Delete hiring.db to reseed with fresh data

const aishaTranscript = [
  { speaker: "agent", text: "Hi Aisha, can you tell me about your operations background?" },
  { speaker: "candidate", text: "I have about 3 years in supply chain coordination and vendor management across Pune and Mumbai lanes." },
  { speaker: "agent", text: "What is one process improvement you personally owned?" },
  { speaker: "candidate", text: "I built a tracking system in Excel that reduced reporting time by 40% and helped supervisors catch delayed dispatches earlier." },
  { speaker: "agent", text: "What would be the main risk if we moved you into a larger operations role?" },
  { speaker: "candidate", text: "I have not formally managed a team yet, but I coordinate daily with vendors and warehouse supervisors." }
];

const priyaTranscript = [
  { speaker: "agent", text: "Priya, can you describe your React and API experience?" },
  { speaker: "candidate", text: "I have built React dashboards and integrated REST APIs for internal tools." },
  { speaker: "agent", text: "Can you walk me through how you would explain a technical issue to a non-technical stakeholder?" },
  { speaker: "candidate", text: "I can explain it step by step if that helps, starting with what the user sees and then the root cause." },
  { speaker: "agent", text: "How comfortable are you with backend services and production deployments?" },
  { speaker: "candidate", text: "I have limited backend exposure and have not owned production deployments myself." }
];

const vikramTranscript = [
  { speaker: "agent", text: "Vikram, tell me about your backend production experience." },
  { speaker: "candidate", text: "I have 4 years of Node.js and microservices experience, including SQL-heavy services." },
  { speaker: "agent", text: "What concerns would you have about this opportunity?" },
  { speaker: "candidate", text: "The range mentioned is below my current package, and my notice period is 90 days." },
  { speaker: "agent", text: "How actively are you looking right now?" },
  { speaker: "candidate", text: "I am open to conversations, but I would move only if compensation and role scope align." }
];

const rahulTranscript = [
  { speaker: "agent", text: "Rahul, can you describe your sales or HR experience?" },
  { speaker: "candidate", text: "I have done sales work before in various companies." },
  { speaker: "agent", text: "Can you share a measurable outcome from your previous role?" },
  { speaker: "candidate", text: "I do not have exact numbers right now, but I used to speak with many customers." },
  { speaker: "agent", text: "What interests you about this Sales/HR role?" },
  { speaker: "candidate", text: "It seems fine, and I can join immediately." }
];

const aishaReport = {
  reportVersion: "1.0",
  candidateId: "cand_001",
  screeningId: "scr_003_demo",
  createdAt: "2026-05-01T10:20:00Z",
  role: { title: "Operations", strategyId: "operations_default" },
  overallRecommendation: "advance",
  overallScore: 82,
  confidence: 0.88,
  scores: { roleFit: 84, communication: 85, experience: 78, intent: 90, problemSolving: 75 },
  sentiment: { label: "positive", confidence: 0.82 },
  strengths: [
    "Strong process improvement mindset",
    "Clear and confident communication",
    "High ownership across vendor coordination"
  ],
  risks: [
    "No formal team leadership experience",
    "Salary expectation not captured"
  ],
  mustHavesMet: ["Vendor coordination", "Deadline management"],
  gaps: ["Team leadership", "ERP system experience"],
  evidence: [
    {
      label: "Process improvement",
      quote: "reduced reporting time by 40%",
      scoreImpact: 14
    },
    {
      label: "Leadership gap",
      quote: "I have not formally managed a team yet",
      scoreImpact: -6
    }
  ],
  extractedFacts: {
    yearsExperience: 3,
    location: "Pune",
    salaryExpectation: null,
    noticePeriodDays: null,
    language: "Hinglish"
  },
  followUpQuestions: [
    "Ask about experience managing shift supervisors or vendor escalation",
    "Clarify salary expectations and notice period"
  ],
  nextAction: "schedule_technical_round",
  recruiterSummary: "Strong operations candidate with clear communication and proven process improvement. Leadership depth needs validation, but the evidence supports advancing to the next round.",
  analysisStatus: "completed",
  language: "Hinglish"
};

const priyaReport = {
  reportVersion: "1.0",
  candidateId: "cand_002",
  screeningId: "scr_002_demo",
  createdAt: "2026-05-01T14:30:00Z",
  role: { title: "Software Engineer", strategyId: "software_engineer_default" },
  overallRecommendation: "review",
  overallScore: 67,
  confidence: 0.72,
  scores: { roleFit: 70, communication: 75, experience: 62, intent: 68, problemSolving: 60 },
  sentiment: { label: "positive", confidence: 0.68 },
  strengths: [
    "Clear verbal communication",
    "Demonstrated genuine interest in the role",
    "Solid understanding of frontend fundamentals"
  ],
  risks: [
    "Limited backend and system design exposure",
    "No production deployment experience mentioned",
    "Uncertain about long-term technical growth direction"
  ],
  mustHavesMet: ["JavaScript", "React", "API integration"],
  gaps: ["System design", "Backend services", "Production ops"],
  evidence: [
    {
      label: "Communication clarity",
      quote: "I can explain it step by step if that helps",
      scoreImpact: 8
    }
  ],
  extractedFacts: {
    yearsExperience: 2,
    location: "Hyderabad",
    salaryExpectation: "12-15 LPA",
    noticePeriodDays: 30,
    language: "English"
  },
  followUpQuestions: [
    "Ask for a specific example of a production bug they debugged",
    "Probe depth on any backend or API experience"
  ],
  nextAction: "schedule_technical_round",
  recruiterSummary: "Promising junior engineer with good communication and enthusiasm. Technical depth is still developing - recommend a focused technical assessment before advancing.",
  analysisStatus: "completed",
  language: "English"
};

const vikramReport = {
  reportVersion: "1.0",
  candidateId: "cand_003",
  screeningId: "scr_003b_demo",
  createdAt: "2026-05-02T11:00:00Z",
  role: { title: "Software Engineer", strategyId: "software_engineer_default" },
  overallRecommendation: "review",
  overallScore: 58,
  confidence: 0.79,
  scores: { roleFit: 72, communication: 65, experience: 74, intent: 38, problemSolving: 68 },
  sentiment: { label: "neutral", confidence: 0.71 },
  strengths: [
    "Strong backend and distributed systems experience",
    "4 years of relevant production work"
  ],
  risks: [
    "Compensation gap: expressed dissatisfaction with compensation range",
    "90-day notice period is an operational risk",
    "Low intent score suggests passive job seeking"
  ],
  mustHavesMet: ["Node.js", "Microservices", "SQL"],
  gaps: ["Cultural alignment", "Intent clarity"],
  evidence: [
    {
      label: "Compensation concern",
      quote: "the range mentioned is below my current package",
      scoreImpact: -18
    }
  ],
  extractedFacts: {
    yearsExperience: 4,
    location: "Bengaluru",
    salaryExpectation: "28+ LPA",
    noticePeriodDays: 90,
    language: "English"
  },
  followUpQuestions: [
    "Clarify whether compensation alignment is possible",
    "Confirm actual availability given 90-day notice"
  ],
  nextAction: "schedule_hr_round",
  recruiterSummary: "Technically strong but low hiring intent. Compensation gap and 90-day notice are significant blockers. Requires HR alignment call before any technical investment.",
  analysisStatus: "completed",
  language: "English"
};

const rahulReport = {
  reportVersion: "1.0",
  candidateId: "cand_004",
  screeningId: "scr_004_demo",
  createdAt: "2026-05-03T09:15:00Z",
  role: { title: "Sales/HR", strategyId: "sales_hr_default" },
  overallRecommendation: "reject",
  overallScore: 41,
  confidence: 0.83,
  scores: { roleFit: 45, communication: 38, experience: 42, intent: 40, problemSolving: 44 },
  sentiment: { label: "negative", confidence: 0.78 },
  strengths: ["Available immediately - no notice period"],
  risks: [
    "Very low communication clarity throughout interview",
    "Unable to describe past sales outcomes with specifics",
    "Disengaged tone - low enthusiasm for the role"
  ],
  mustHavesMet: [],
  gaps: ["Communication", "Role clarity", "Sales outcomes"],
  evidence: [
    {
      label: "Vague experience description",
      quote: "I have done sales work before in various companies",
      scoreImpact: -15
    }
  ],
  extractedFacts: {
    yearsExperience: 3,
    location: "Delhi",
    salaryExpectation: null,
    noticePeriodDays: 0,
    language: "Hindi"
  },
  followUpQuestions: [],
  nextAction: "reject_candidate",
  recruiterSummary: "Candidate did not meet the minimum communication threshold for a Sales/HR role. Vague answers, low energy, and no quantifiable experience. Not recommended for advancement.",
  analysisStatus: "completed",
  language: "Hindi"
};

async function seedCandidates() {
  const candidates = [
    ["cand_001", "Aisha Khan", "Operations", "aisha.khan@hireiq-demo.com", "+91-98765-43210", "Hinglish", "2026-04-28", "completed", 82, "advance"],
    ["cand_002", "Priya Sharma", "Software Engineer", "priya.sharma@hireiq-demo.com", "+91-98765-43211", "English", "2026-04-29", "completed", 67, "review"],
    ["cand_003", "Vikram Nair", "Software Engineer", "vikram.nair@hireiq-demo.com", "+91-98765-43212", "English", "2026-04-30", "completed", 58, "review"],
    ["cand_004", "Rahul Verma", "Sales/HR", "rahul.verma@hireiq-demo.com", "+91-98765-43213", "Hindi", "2026-05-01", "completed", 41, "reject"],
    ["cand_005", "Sneha Patel", "Operations", "sneha.patel@hireiq-demo.com", "+91-98765-43214", "English", "2026-05-02", "pending", null, null],
    ["cand_006", "Arjun Mehta", "Sales/HR", "arjun.mehta@hireiq-demo.com", "+91-98765-43215", "Hindi", "2026-05-01", "failed", null, null]
  ];

  for (const candidate of candidates) {
    await run(
      `INSERT OR IGNORE INTO candidates (
        id,
        name,
        role,
        email,
        phone,
        language_preference,
        applied_date,
        latest_status,
        latest_overall_score,
        latest_recommendation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      candidate
    );
  }
}

async function seedScreenings() {
  const screenings = [
    [
      "scr_003_demo",
      "cand_001",
      "completed",
      "demo_call_001",
      JSON.stringify(aishaTranscript),
      "Candidate demonstrated strong operational understanding and clear communication. Expressed high interest in the role.",
      JSON.stringify(aishaReport),
      "2026-05-01T10:00:00Z",
      "2026-05-01T10:18:00Z"
    ],
    [
      "scr_002_demo",
      "cand_002",
      "completed",
      "demo_call_002",
      JSON.stringify(priyaTranscript),
      "Candidate showed solid technical foundations but hesitated on system design questions. Communication was clear and professional.",
      JSON.stringify(priyaReport),
      "2026-05-01T14:00:00Z",
      "2026-05-01T14:30:00Z"
    ],
    [
      "scr_003b_demo",
      "cand_003",
      "completed",
      "demo_call_003",
      JSON.stringify(vikramTranscript),
      "Candidate has strong experience but raised significant concerns around compensation expectations and notice period.",
      JSON.stringify(vikramReport),
      "2026-05-02T10:30:00Z",
      "2026-05-02T11:00:00Z"
    ],
    [
      "scr_004_demo",
      "cand_004",
      "completed",
      "demo_call_004",
      JSON.stringify(rahulTranscript),
      "Candidate struggled to articulate past experience and showed limited engagement throughout the interview.",
      JSON.stringify(rahulReport),
      "2026-05-03T09:00:00Z",
      "2026-05-03T09:15:00Z"
    ],
    [
      "scr_006_demo",
      "cand_006",
      "failed",
      "failed_call_001",
      null,
      null,
      null,
      "2026-05-04T10:00:00Z",
      "2026-05-04T10:01:00Z"
    ]
  ];

  for (const screening of screenings) {
    await run(
      `INSERT OR IGNORE INTO screenings (
        id,
        candidate_id,
        status,
        bolna_call_id,
        transcript_json,
        provider_summary,
        analysis_report,
        started_at,
        completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      screening
    );
  }
}

async function initializeDatabase() {
  await exec("PRAGMA foreign_keys = ON;");
  await exec(schemaSql);
  console.log("Database initialized");
  await seedCandidates();
  await seedScreenings();
  console.log("Database seed complete");
}

await initializeDatabase();

export default db;
