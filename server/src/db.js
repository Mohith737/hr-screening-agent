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

const seededTranscript = [
  {
    speaker: "agent",
    text: "Hi Aisha, thanks for taking the time today. Can you tell me a bit about your background in operations?"
  },
  {
    speaker: "candidate",
    text: "Sure! I have about 3 years working in supply chain coordination and vendor management for a mid-size logistics company."
  },
  {
    speaker: "agent",
    text: "Great. How comfortable are you handling multiple priorities under tight deadlines?"
  },
  {
    speaker: "candidate",
    text: "Very comfortable. I actually built a tracking system in Excel that reduced our reporting time by 40%."
  },
  {
    speaker: "agent",
    text: "That's impressive. Are you open to relocation if required?"
  },
  {
    speaker: "candidate",
    text: "Yes, I'm flexible. I'm currently in Pune but open to Mumbai or Bengaluru."
  }
];

const seededAnalysisReport = {
  reportVersion: "1.0",
  candidateId: "cand_003",
  screeningId: "scr_003_demo",
  createdAt: "2026-05-03T10:20:00Z",
  role: { title: "Operations", strategyId: "operations_default" },
  overallRecommendation: "advance",
  overallScore: 82,
  confidence: 0.88,
  scores: {
    roleFit: 84,
    communication: 85,
    experience: 78,
    intent: 90,
    conversion: 75
  },
  sentiment: { label: "positive", confidence: 0.82 },
  strengths: [
    "Strong process improvement mindset",
    "Clear and confident communication",
    "High mobility and flexibility"
  ],
  risks: [
    "No mention of team leadership experience",
    "Salary expectation not captured"
  ],
  mustHavesMet: ["Vendor coordination", "Deadline management"],
  gaps: ["Team leadership", "ERP system experience"],
  evidence: [
    {
      label: "Process improvement",
      quote: "built a tracking system in Excel that reduced reporting time by 40%",
      impact: 14
    }
  ],
  extractedFacts: {
    yearsExperience: 3,
    noticePeriodDays: null,
    location: "Pune",
    salaryExpectation: null,
    language: "Hinglish"
  },
  followUpQuestions: [
    "Ask about experience managing a team",
    "Clarify salary expectations and notice period"
  ],
  nextAction: "schedule_technical_round",
  recruiterSummary: "Strong operations candidate with clear communication and proven process improvement. High intent. Recommend advancing to next round."
};

async function seedCandidates() {
  const candidates = [
    [
      "cand_001",
      "Priya Sharma",
      "Software Engineer",
      "priya.sharma@example.com",
      "+91-9876543210",
      "English",
      "2026-04-28",
      "pending",
      null,
      null
    ],
    [
      "cand_002",
      "Rahul Verma",
      "Sales/HR",
      "rahul.verma@example.com",
      "+91-9876543211",
      "Hindi",
      "2026-04-29",
      "pending",
      null,
      null
    ],
    [
      "cand_003",
      "Aisha Khan",
      "Operations",
      "aisha.khan@example.com",
      "+91-9876543212",
      "Hinglish",
      "2026-04-30",
      "completed",
      82,
      "advance"
    ],
    [
      "cand_004",
      "Vikram Nair",
      "Software Engineer",
      "vikram.nair@example.com",
      "+91-9876543213",
      "English",
      "2026-05-01",
      "pending",
      null,
      null
    ],
    [
      "cand_005",
      "Sneha Patel",
      "Operations",
      "sneha.patel@example.com",
      "+91-9876543214",
      "Hinglish",
      "2026-05-02",
      "pending",
      null,
      null
    ],
    [
      "cand_006",
      "Arjun Mehta",
      "Sales/HR",
      "arjun.mehta@example.com",
      "+91-9876543215",
      "Hindi",
      "2026-05-03",
      "pending",
      null,
      null
    ]
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
    [
      "scr_003_demo",
      "cand_003",
      "completed",
      "demo_call_001",
      JSON.stringify(seededTranscript),
      "Candidate demonstrated strong operational understanding and clear communication. Expressed high interest in the role.",
      JSON.stringify(seededAnalysisReport),
      "2026-05-03T10:00:00Z",
      "2026-05-03T10:18:00Z"
    ]
  );
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
