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

function makeTranscript(opening, proof, tradeoff, closing) {
  return [
    { speaker: "agent", text: opening },
    { speaker: "candidate", text: proof },
    { speaker: "agent", text: "What would your manager say is the main risk in hiring you for this role?" },
    { speaker: "candidate", text: tradeoff },
    { speaker: "agent", text: "What are you optimizing for in your next move?" },
    { speaker: "candidate", text: closing }
  ];
}

function makeReport({
  candidateId,
  screeningId,
  role,
  score,
  recommendation,
  confidence,
  scores,
  strengths,
  risks,
  evidence,
  facts,
  followUps,
  nextAction,
  summary,
  createdAt
}) {
  return {
    reportVersion: "1.0",
    candidateId,
    screeningId,
    createdAt,
    role: { title: role, strategyId: `${role.toLowerCase().replace(/[^a-z]+/g, "_")}_default` },
    overallRecommendation: recommendation,
    overallScore: score,
    confidence,
    scores,
    sentiment: { label: score >= 75 ? "positive" : score >= 55 ? "neutral" : "negative", confidence },
    strengths,
    risks,
    mustHavesMet: strengths.slice(0, 2),
    gaps: risks.slice(0, 2),
    evidence,
    extractedFacts: facts,
    followUpQuestions: followUps,
    nextAction,
    recruiterSummary: summary
  };
}

const seededScreenings = [
  {
    id: "scr_017_demo",
    candidateId: "cand_017",
    status: "completed",
    completedAt: "2026-05-06T09:42:00Z",
    transcript: makeTranscript(
      "Hi Saanvi, walk me through your sales and HR operating rhythm.",
      "I managed a 9-person hiring pod and closed 42 priority roles last year while keeping offer dropouts below 8%.",
      "I can over-index on speed, so I now use scorecards and weekly calibration to avoid pushing weak fits.",
      "I want a role where hiring velocity and stakeholder trust both matter."
    ),
    providerSummary: "Exceptional Sales/HR operator with strong metrics, structure, and stakeholder maturity.",
    report: makeReport({
      candidateId: "cand_017",
      screeningId: "scr_017_demo",
      role: "Sales/HR",
      score: 91,
      recommendation: "advance",
      confidence: 0.93,
      createdAt: "2026-05-06T09:45:00Z",
      scores: { roleFit: 94, communication: 92, experience: 90, intent: 88, problemSolving: 91 },
      strengths: ["Proven high-volume hiring execution", "Strong calibration discipline", "Clear stakeholder communication"],
      risks: ["May push pace aggressively", "Compensation expectation is near top of band"],
      evidence: [{ label: "Hiring velocity", quote: "closed 42 priority roles last year", impact: 16 }],
      facts: { yearsExperience: 6, noticePeriodDays: 30, location: "Gurugram", salaryExpectation: "24 LPA", language: "English" },
      followUps: ["Validate compensation flexibility", "Ask for one failed hiring case and lesson learned"],
      nextAction: "schedule_hr_round",
      summary: "Exceptional Sales/HR candidate with rare combination of speed, process discipline, and stakeholder maturity. Advance quickly."
    })
  },
  {
    id: "scr_011_demo",
    candidateId: "cand_011",
    status: "completed",
    completedAt: "2026-05-06T08:58:00Z",
    transcript: makeTranscript(
      "Imran, tell me about the operations scope you have owned.",
      "I owned night-shift dispatch for 18 hubs and brought SLA misses down from 11% to 3% in two quarters.",
      "I have not worked much with ERP customization, mostly dashboards and standard workflows.",
      "I am looking for a larger network role where I can own measurable service levels."
    ),
    providerSummary: "Exceptional operations owner with measurable scale and high intent; ERP depth needs validation.",
    report: makeReport({
      candidateId: "cand_011",
      screeningId: "scr_011_demo",
      role: "Operations",
      score: 89,
      recommendation: "advance",
      confidence: 0.9,
      createdAt: "2026-05-06T09:02:00Z",
      scores: { roleFit: 92, communication: 86, experience: 91, intent: 90, problemSolving: 87 },
      strengths: ["Owned multi-hub operations", "Quantified SLA improvement", "High intent for operating ownership"],
      risks: ["Limited ERP customization exposure", "Night-shift context may differ from current role"],
      evidence: [{ label: "SLA improvement", quote: "brought SLA misses down from 11% to 3%", impact: 18 }],
      facts: { yearsExperience: 7, noticePeriodDays: 45, location: "Nagpur", salaryExpectation: "18 LPA", language: "Hindi" },
      followUps: ["Probe ERP and WMS depth", "Ask how he handles day-shift stakeholder escalations"],
      nextAction: "schedule_technical_round",
      summary: "Exceptional operations candidate with direct ownership and measurable service improvements. Minor tooling gap is manageable."
    })
  },
  {
    id: "scr_001_demo",
    candidateId: "cand_001",
    status: "completed",
    completedAt: "2026-05-05T16:30:00Z",
    transcript: makeTranscript(
      "Priya, describe the most complex system you built recently.",
      "I redesigned our notification service into an event-driven flow and reduced p95 latency from 900ms to 240ms.",
      "I have done less people mentoring than I would like, mostly pairing with one junior engineer.",
      "I want a backend-heavy role with ownership of reliability and scale."
    ),
    providerSummary: "Exceptional software engineer with concrete architecture and performance evidence; mentorship depth is lighter.",
    report: makeReport({
      candidateId: "cand_001",
      screeningId: "scr_001_demo",
      role: "Software Engineer",
      score: 88,
      recommendation: "advance",
      confidence: 0.91,
      createdAt: "2026-05-05T16:35:00Z",
      scores: { roleFit: 90, communication: 84, experience: 88, intent: 89, problemSolving: 91 },
      strengths: ["Strong backend architecture", "Clear performance impact", "High ownership orientation"],
      risks: ["Limited formal mentoring experience", "Mostly backend exposure"],
      evidence: [{ label: "Performance impact", quote: "reduced p95 latency from 900ms to 240ms", impact: 17 }],
      facts: { yearsExperience: 5, noticePeriodDays: 30, location: "Bengaluru", salaryExpectation: "32 LPA", language: "English" },
      followUps: ["Run system design around async failure modes", "Validate mentoring expectations"],
      nextAction: "schedule_technical_round",
      summary: "Exceptional backend candidate with strong architecture and measurable impact. Advance for system design."
    })
  },
  {
    id: "scr_014_demo",
    candidateId: "cand_014",
    status: "completed",
    completedAt: "2026-05-05T14:15:00Z",
    transcript: makeTranscript(
      "Nisha, how do you handle a difficult hiring manager?",
      "I set a weekly funnel review, showed pass-through data, and changed the screen after evidence showed we were rejecting too early.",
      "I can be direct when targets are at risk, so I document decisions to keep alignment clear.",
      "I want to lead recruiting operations for a growing team."
    ),
    providerSummary: "Strong Sales/HR candidate with structured stakeholder management and good operating maturity.",
    report: makeReport({
      candidateId: "cand_014",
      screeningId: "scr_014_demo",
      role: "Sales/HR",
      score: 86,
      recommendation: "advance",
      confidence: 0.87,
      createdAt: "2026-05-05T14:20:00Z",
      scores: { roleFit: 87, communication: 88, experience: 84, intent: 86, problemSolving: 85 },
      strengths: ["Structured stakeholder management", "Uses funnel data", "Good decision documentation"],
      risks: ["Direct style may need calibration", "Limited exposure to sales hiring"],
      evidence: [{ label: "Data-led calibration", quote: "changed the screen after evidence showed we were rejecting too early", impact: 13 }],
      facts: { yearsExperience: 5, noticePeriodDays: 30, location: "Mumbai", salaryExpectation: "21 LPA", language: "English" },
      followUps: ["Ask for sales hiring examples", "Probe conflict handling with senior stakeholders"],
      nextAction: "schedule_hr_round",
      summary: "Strong recruiter with mature process habits and evidence-based stakeholder management. Advance with role-scope validation."
    })
  },
  {
    id: "scr_003_demo",
    candidateId: "cand_003",
    status: "completed",
    completedAt: "2026-05-03T10:18:00Z",
    transcript: makeTranscript(
      "Hi Aisha, can you tell me about your background in operations?",
      "I have about 3 years in supply chain coordination and built a tracking system in Excel that reduced reporting time by 40%.",
      "I have not formally led a team yet, but I coordinate daily with vendors and warehouse supervisors.",
      "I am flexible on location and want a role where I can improve broken processes."
    ),
    providerSummary: "Strong operations candidate with process improvement evidence, high intent, and a leadership gap.",
    report: makeReport({
      candidateId: "cand_003",
      screeningId: "scr_003_demo",
      role: "Operations",
      score: 82,
      recommendation: "advance",
      confidence: 0.88,
      createdAt: "2026-05-03T10:20:00Z",
      scores: { roleFit: 84, communication: 85, experience: 78, intent: 90, problemSolving: 75 },
      strengths: ["Strong process improvement mindset", "Clear and confident communication", "High mobility and flexibility"],
      risks: ["No formal team leadership experience", "Salary expectation not captured"],
      evidence: [{ label: "Process improvement", quote: "reduced reporting time by 40%", impact: 14 }],
      facts: { yearsExperience: 3, noticePeriodDays: null, location: "Pune", salaryExpectation: null, language: "Hinglish" },
      followUps: ["Ask about experience managing a team", "Clarify salary expectations and notice period"],
      nextAction: "schedule_technical_round",
      summary: "Strong operations candidate with clear communication and proven process improvement. Leadership depth needs validation."
    })
  },
  {
    id: "scr_004_demo",
    candidateId: "cand_004",
    status: "completed",
    completedAt: "2026-05-04T17:05:00Z",
    transcript: makeTranscript(
      "Vikram, walk me through a system design decision you are proud of.",
      "I split a billing monolith into services and introduced idempotency keys to stop duplicate invoices during retries.",
      "I am not actively looking; I would move only if the technical scope is clearly stronger.",
      "I care most about architecture ownership, not title."
    ),
    providerSummary: "Strong technical depth but low intent; recruiter should prioritize only if role scope is compelling.",
    report: makeReport({
      candidateId: "cand_004",
      screeningId: "scr_004_demo",
      role: "Software Engineer",
      score: 79,
      recommendation: "review",
      confidence: 0.84,
      createdAt: "2026-05-04T17:10:00Z",
      scores: { roleFit: 86, communication: 76, experience: 84, intent: 52, problemSolving: 88 },
      strengths: ["Strong distributed systems depth", "Good failure-mode thinking", "Relevant billing experience"],
      risks: ["Low active intent", "May reject unless scope is senior enough"],
      evidence: [{ label: "Reliability depth", quote: "introduced idempotency keys to stop duplicate invoices", impact: 15 }],
      facts: { yearsExperience: 8, noticePeriodDays: 60, location: "Chennai", salaryExpectation: "45 LPA", language: "English" },
      followUps: ["Confirm motivation and offer probability", "Assess compensation flexibility"],
      nextAction: "manual_review",
      summary: "Technically strong but low-intent. Worth recruiter follow-up only if the role can meet architecture ownership expectations."
    })
  },
  {
    id: "scr_005_demo",
    candidateId: "cand_005",
    status: "completed",
    completedAt: "2026-05-04T11:22:00Z",
    transcript: makeTranscript(
      "Sneha, what operation have you personally improved?",
      "I took ownership of returns reconciliation and reduced pending cases from 620 to 210 in one month.",
      "I get uncomfortable escalating people issues; I usually try to solve them myself first.",
      "I want to move into a role with more ownership, even if it stretches me."
    ),
    providerSummary: "Average-to-strong operations candidate with ownership and execution, but weak people escalation instincts.",
    report: makeReport({
      candidateId: "cand_005",
      screeningId: "scr_005_demo",
      role: "Operations",
      score: 73,
      recommendation: "review",
      confidence: 0.78,
      createdAt: "2026-05-04T11:27:00Z",
      scores: { roleFit: 76, communication: 70, experience: 72, intent: 82, problemSolving: 68 },
      strengths: ["Takes ownership of messy processes", "Good execution urgency", "High growth intent"],
      risks: ["Weak escalation habits", "Leadership readiness unclear"],
      evidence: [{ label: "Backlog reduction", quote: "reduced pending cases from 620 to 210", impact: 12 }],
      facts: { yearsExperience: 4, noticePeriodDays: 15, location: "Ahmedabad", salaryExpectation: "12 LPA", language: "Hinglish" },
      followUps: ["Ask for a people escalation example", "Validate comfort managing supervisors"],
      nextAction: "manual_review",
      summary: "Useful operations candidate with clear ownership, but leadership and escalation maturity are open questions."
    })
  },
  {
    id: "scr_007_demo",
    candidateId: "cand_007",
    status: "completed",
    completedAt: "2026-05-04T09:10:00Z",
    transcript: makeTranscript(
      "Neel, explain a technical problem you solved recently.",
      "I improved the onboarding flow and users said it felt much clearer, but the backend work was mostly API wiring.",
      "My technical depth is still growing; I am strongest when requirements are ambiguous and need product thinking.",
      "I want a team where I can learn from senior engineers."
    ),
    providerSummary: "High-potential software candidate with excellent communication and product sense but limited depth.",
    report: makeReport({
      candidateId: "cand_007",
      screeningId: "scr_007_demo",
      role: "Software Engineer",
      score: 67,
      recommendation: "review",
      confidence: 0.72,
      createdAt: "2026-05-04T09:15:00Z",
      scores: { roleFit: 62, communication: 88, experience: 55, intent: 84, problemSolving: 60 },
      strengths: ["Excellent communication", "Strong product empathy", "High learning intent"],
      risks: ["Weak technical depth", "Needs senior support"],
      evidence: [{ label: "Self-awareness", quote: "My technical depth is still growing", impact: -6 }],
      facts: { yearsExperience: 2, noticePeriodDays: 30, location: "Delhi", salaryExpectation: "18 LPA", language: "English" },
      followUps: ["Run practical coding screen", "Assess learning velocity and fundamentals"],
      nextAction: "manual_review",
      summary: "High-potential edge case: strong communicator and product thinker, but technical depth is not yet proven."
    })
  },
  {
    id: "scr_002_demo",
    candidateId: "cand_002",
    status: "completed",
    completedAt: "2026-05-03T15:40:00Z",
    transcript: makeTranscript(
      "Rahul, tell me how you run a sales or hiring pipeline.",
      "I talk to people daily and can convince hesitant candidates because I build rapport quickly.",
      "I do not use a strict tracker; I usually remember the important follow-ups in my head.",
      "I want incentives, ownership, and a target-driven culture."
    ),
    providerSummary: "Charismatic Sales/HR candidate with weak structure; may work in high-touch roles with process support.",
    report: makeReport({
      candidateId: "cand_002",
      screeningId: "scr_002_demo",
      role: "Sales/HR",
      score: 62,
      recommendation: "review",
      confidence: 0.69,
      createdAt: "2026-05-03T15:45:00Z",
      scores: { roleFit: 63, communication: 82, experience: 58, intent: 76, problemSolving: 45 },
      strengths: ["Charismatic communicator", "High target orientation", "Good rapport building"],
      risks: ["Low process structure", "Follow-up discipline unproven"],
      evidence: [{ label: "Process gap", quote: "I do not use a strict tracker", impact: -10 }],
      facts: { yearsExperience: 3, noticePeriodDays: 20, location: "Jaipur", salaryExpectation: "10 LPA + incentives", language: "Hindi" },
      followUps: ["Ask how he prevents missed follow-ups", "Validate CRM discipline"],
      nextAction: "manual_review",
      summary: "Ambiguous Sales/HR profile: strong persuasion and energy, but process discipline is a meaningful risk."
    })
  },
  {
    id: "scr_015_demo",
    candidateId: "cand_015",
    status: "completed",
    completedAt: "2026-05-02T13:05:00Z",
    transcript: makeTranscript(
      "Farhan, describe your HR operations experience.",
      "I handled onboarding and payroll coordination for many employees, but I do not remember exact numbers right now.",
      "Sometimes I explain too much context before getting to the answer.",
      "I want stability and a better commute."
    ),
    providerSummary: "Experienced but unclear Sales/HR candidate; recruiter should validate ownership and metrics.",
    report: makeReport({
      candidateId: "cand_015",
      screeningId: "scr_015_demo",
      role: "Sales/HR",
      score: 58,
      recommendation: "review",
      confidence: 0.62,
      createdAt: "2026-05-02T13:10:00Z",
      scores: { roleFit: 60, communication: 49, experience: 72, intent: 55, problemSolving: 54 },
      strengths: ["Relevant HR operations exposure", "Stable work history", "Understands onboarding basics"],
      risks: ["Poor clarity", "Weak metrics recall", "Motivation is mostly convenience"],
      evidence: [{ label: "Metrics gap", quote: "I do not remember exact numbers right now", impact: -9 }],
      facts: { yearsExperience: 8, noticePeriodDays: 30, location: "Noida", salaryExpectation: "16 LPA", language: "Hindi" },
      followUps: ["Ask for exact headcount and payroll scope", "Probe motivation beyond commute"],
      nextAction: "manual_review",
      summary: "Experienced but low-clarity candidate. Keep as backup unless follow-up confirms real ownership and metrics."
    })
  },
  {
    id: "scr_008_demo",
    candidateId: "cand_008",
    status: "completed",
    completedAt: "2026-05-02T10:35:00Z",
    transcript: makeTranscript(
      "Kavya, can you explain your last architecture project?",
      "There were many modules and integrations, and I was involved in most of them, but the exact boundaries are hard to summarize.",
      "I tend to go deep into details and sometimes lose the main point.",
      "I am open, but I need clarity on team stability before moving."
    ),
    providerSummary: "High-experience software candidate with poor clarity and uncertain ownership boundaries.",
    report: makeReport({
      candidateId: "cand_008",
      screeningId: "scr_008_demo",
      role: "Software Engineer",
      score: 53,
      recommendation: "review",
      confidence: 0.64,
      createdAt: "2026-05-02T10:40:00Z",
      scores: { roleFit: 58, communication: 42, experience: 79, intent: 51, problemSolving: 56 },
      strengths: ["High years of experience", "Exposure to integrations", "Asks about team stability"],
      risks: ["Poor clarity", "Ownership boundaries unclear", "Intent depends on stability guarantees"],
      evidence: [{ label: "Clarity risk", quote: "the exact boundaries are hard to summarize", impact: -12 }],
      facts: { yearsExperience: 9, noticePeriodDays: 60, location: "Hyderabad", salaryExpectation: "38 LPA", language: "English" },
      followUps: ["Run structured deep-dive on one project", "Ask for exact ownership and decisions made"],
      nextAction: "manual_review",
      summary: "Risky senior profile: experience is real, but clarity and ownership evidence are weak. Needs careful technical validation."
    })
  },
  {
    id: "scr_013_demo",
    candidateId: "cand_013",
    status: "completed",
    completedAt: "2026-05-01T18:20:00Z",
    transcript: makeTranscript(
      "Devika, what operating process would you change first in a new team?",
      "I prefer to observe for a long time because frequent process changes create confusion.",
      "I am not very comfortable pushing back on senior stakeholders unless my manager supports it.",
      "I want a predictable operations role with clear instructions."
    ),
    providerSummary: "Risky operations candidate with experience but low change ownership and stakeholder confidence.",
    report: makeReport({
      candidateId: "cand_013",
      screeningId: "scr_013_demo",
      role: "Operations",
      score: 46,
      recommendation: "review",
      confidence: 0.71,
      createdAt: "2026-05-01T18:25:00Z",
      scores: { roleFit: 48, communication: 58, experience: 61, intent: 42, problemSolving: 38 },
      strengths: ["Operational patience", "Stable execution background", "Low-risk communication style"],
      risks: ["Low change ownership", "Weak stakeholder pushback", "Prefers instruction over ambiguity"],
      evidence: [{ label: "Ownership risk", quote: "I prefer to observe for a long time", impact: -11 }],
      facts: { yearsExperience: 6, noticePeriodDays: 45, location: "Lucknow", salaryExpectation: "11 LPA", language: "Hindi" },
      followUps: ["Ask for one proactive improvement example", "Probe comfort with ambiguous escalation"],
      nextAction: "manual_review",
      summary: "Risky operations candidate. Could fit stable execution roles, but not a strong match for ownership-heavy operations."
    })
  },
  {
    id: "scr_009_demo",
    candidateId: "cand_009",
    status: "completed",
    completedAt: "2026-05-01T12:12:00Z",
    transcript: makeTranscript(
      "Rohan, how would you debug a slow API?",
      "I would restart the server first and then check if users still complain.",
      "I have not used profiling tools much; I mostly search online and try fixes.",
      "I need my first strong engineering role and I am willing to learn."
    ),
    providerSummary: "Weak software fundamentals despite positive intent; not ready for current engineering role.",
    report: makeReport({
      candidateId: "cand_009",
      screeningId: "scr_009_demo",
      role: "Software Engineer",
      score: 34,
      recommendation: "reject",
      confidence: 0.83,
      createdAt: "2026-05-01T12:16:00Z",
      scores: { roleFit: 30, communication: 55, experience: 28, intent: 76, problemSolving: 22 },
      strengths: ["High learning intent", "Honest about gaps", "Basic communication is acceptable"],
      risks: ["Weak debugging fundamentals", "No profiling experience", "Needs close supervision"],
      evidence: [{ label: "Debugging gap", quote: "I would restart the server first", impact: -18 }],
      facts: { yearsExperience: 1, noticePeriodDays: 15, location: "Indore", salaryExpectation: "9 LPA", language: "Hinglish" },
      followUps: ["Consider internship or junior pipeline only", "Do not proceed for current role"],
      nextAction: "reject_candidate",
      summary: "Weak fit for the current software role. Good intent, but fundamentals are below the hiring bar."
    })
  }
];

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
      "completed",
      88,
      "advance"
    ],
    [
      "cand_002",
      "Rahul Verma",
      "Sales/HR",
      "rahul.verma@example.com",
      "+91-9876543211",
      "Hindi",
      "2026-04-29",
      "completed",
      62,
      "review"
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
      "completed",
      79,
      "review"
    ],
    [
      "cand_005",
      "Sneha Patel",
      "Operations",
      "sneha.patel@example.com",
      "+91-9876543214",
      "Hinglish",
      "2026-05-02",
      "completed",
      73,
      "review"
    ],
    [
      "cand_006",
      "Arjun Mehta",
      "Sales/HR",
      "arjun.mehta@example.com",
      "+91-9876543215",
      "Hindi",
      "2026-05-03",
      "failed",
      null,
      null
    ],
    [
      "cand_007",
      "Neel Bhatia",
      "Software Engineer",
      "neel.bhatia@example.com",
      "+91-9876543216",
      "English",
      "2026-05-03",
      "completed",
      67,
      "review"
    ],
    [
      "cand_008",
      "Kavya Rao",
      "Software Engineer",
      "kavya.rao@example.com",
      "+91-9876543217",
      "English",
      "2026-05-04",
      "completed",
      53,
      "review"
    ],
    [
      "cand_009",
      "Rohan Sinha",
      "Software Engineer",
      "rohan.sinha@example.com",
      "+91-9876543218",
      "Hinglish",
      "2026-05-04",
      "completed",
      34,
      "reject"
    ],
    [
      "cand_010",
      "Meera Iyer",
      "Software Engineer",
      "meera.iyer@example.com",
      "+91-9876543219",
      "English",
      "2026-05-05",
      "pending",
      null,
      null
    ],
    [
      "cand_011",
      "Imran Qureshi",
      "Operations",
      "imran.qureshi@example.com",
      "+91-9876543220",
      "Hindi",
      "2026-05-01",
      "completed",
      89,
      "advance"
    ],
    [
      "cand_012",
      "Pooja Menon",
      "Operations",
      "pooja.menon@example.com",
      "+91-9876543221",
      "Hinglish",
      "2026-05-06",
      "screening",
      null,
      null
    ],
    [
      "cand_013",
      "Devika Singh",
      "Operations",
      "devika.singh@example.com",
      "+91-9876543222",
      "Hindi",
      "2026-05-02",
      "completed",
      46,
      "review"
    ],
    [
      "cand_014",
      "Nisha Kapoor",
      "Sales/HR",
      "nisha.kapoor@example.com",
      "+91-9876543223",
      "English",
      "2026-05-04",
      "completed",
      86,
      "advance"
    ],
    [
      "cand_015",
      "Farhan Ali",
      "Sales/HR",
      "farhan.ali@example.com",
      "+91-9876543224",
      "Hindi",
      "2026-05-02",
      "completed",
      58,
      "review"
    ],
    [
      "cand_016",
      "Tara D'Souza",
      "Sales/HR",
      "tara.dsouza@example.com",
      "+91-9876543225",
      "English",
      "2026-05-06",
      "pending",
      null,
      null
    ],
    [
      "cand_017",
      "Saanvi Reddy",
      "Sales/HR",
      "saanvi.reddy@example.com",
      "+91-9876543226",
      "English",
      "2026-05-05",
      "completed",
      91,
      "advance"
    ]
  ];

  for (const candidate of candidates) {
    await run(
      `INSERT INTO candidates (
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        role = excluded.role,
        email = excluded.email,
        phone = excluded.phone,
        language_preference = excluded.language_preference,
        applied_date = excluded.applied_date,
        latest_status = excluded.latest_status,
        latest_overall_score = excluded.latest_overall_score,
        latest_recommendation = excluded.latest_recommendation`,
      candidate
    );
  }
}

async function seedScreenings() {
  const operationalScreenings = [
    ...seededScreenings,
    {
      id: "scr_012_demo",
      candidateId: "cand_012",
      status: "screening",
      completedAt: null,
      transcript: [],
      providerSummary: "Screening call is currently in progress.",
      report: null
    },
    {
      id: "scr_006_demo",
      candidateId: "cand_006",
      status: "failed",
      completedAt: null,
      transcript: [],
      providerSummary: "Call failed before the candidate could complete screening.",
      report: null
    }
  ];
  const seededCandidateIds = [...new Set(operationalScreenings.map((screening) => screening.candidateId))];
  const seededScreeningIds = operationalScreenings.map((screening) => screening.id);

  await run(
    `DELETE FROM screenings
     WHERE candidate_id IN (${seededCandidateIds.map(() => "?").join(",")})
       AND id NOT IN (${seededScreeningIds.map(() => "?").join(",")})`,
    [...seededCandidateIds, ...seededScreeningIds]
  );

  for (const screening of operationalScreenings) {
    await run(
      `INSERT INTO screenings (
        id,
        candidate_id,
        status,
        bolna_call_id,
        transcript_json,
        provider_summary,
        analysis_report,
        started_at,
        completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        candidate_id = excluded.candidate_id,
        status = excluded.status,
        bolna_call_id = excluded.bolna_call_id,
        transcript_json = excluded.transcript_json,
        provider_summary = excluded.provider_summary,
        analysis_report = excluded.analysis_report,
        started_at = excluded.started_at,
        completed_at = excluded.completed_at`,
      [
        screening.id,
        screening.candidateId,
        screening.status,
        `demo_call_${screening.id}`,
        JSON.stringify(screening.transcript),
        screening.providerSummary,
        screening.report ? JSON.stringify(screening.report) : null,
        screening.completedAt || "2026-05-06T10:00:00Z",
        screening.completedAt
      ]
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
