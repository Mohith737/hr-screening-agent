const SCORE_KEYS = ["roleFit", "communication", "experience", "intent", "problemSolving"];
const EMPTY_FACTS = {
  yearsExperience: null,
  location: null,
  salaryExpectation: null,
  noticePeriodDays: null,
  language: null
};

export const ANALYSIS_SCHEMA_DESCRIPTION = `Return a JSON object with these exact fields and no extras: reportVersion (string "1.0"), analysisStatus (string "completed"), candidateId (string), screeningId (string), createdAt (ISO timestamp string), role (object with title:string and strategyId:string), language (string: English, Hindi, or Hinglish), overallRecommendation (string exactly one of: advance, review, reject), overallScore (integer 0-100), confidence (number 0.0-1.0), scores (object with integer fields roleFit, communication, experience, intent, problemSolving, each 0-100), sentiment (object with label exactly one of positive, neutral, negative and confidence number 0.0-1.0), strengths (array of short strings), risks (array of short strings), mustHavesMet (array of strings), gaps (array of strings), evidence (array of objects with label:string, quote:string copied verbatim from transcript, impact:integer 0-100), extractedFacts (object with yearsExperience:number|null, location:string|null, salaryExpectation:string|null, noticePeriodDays:number|null, language:string|null), followUpQuestions (array of strings), nextAction (string), recruiterSummary (string).`;

function clampScore(value) {
  const number = Number(value);
  return Math.min(100, Math.max(0, Number.isFinite(number) ? number : 50));
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function validateAndNormalize(rawReport, transcript, overallScore, recommendation) {
  const report = rawReport && typeof rawReport === "object" ? { ...rawReport } : {};
  const rawScores = report.scores && typeof report.scores === "object" ? report.scores : {};
  const transcriptText = normalizeText((transcript || []).map((turn) => turn?.text || "").join(" "));

  report.scores = Object.fromEntries(SCORE_KEYS.map((key) => [key, clampScore(rawScores[key])]));
  report.strengths = Array.isArray(report.strengths) ? report.strengths.filter(Boolean).slice(0, 4) : [];
  report.risks = Array.isArray(report.risks) ? report.risks.filter(Boolean).slice(0, 4) : [];
  report.mustHavesMet = Array.isArray(report.mustHavesMet) ? report.mustHavesMet.filter(Boolean) : [];
  report.gaps = Array.isArray(report.gaps) ? report.gaps.filter(Boolean) : [];
  report.evidence = (Array.isArray(report.evidence) ? report.evidence : []).filter((item) => {
    const quote = typeof item?.quote === "string" ? item.quote.trim() : "";

    if (!quote || !transcriptText.includes(normalizeText(quote))) {
      if (quote) {
        console.warn("[ANALYSIS] Evidence quote not verified, removed:", quote.substring(0, 60));
      }
      return false;
    }

    item.impact = Math.round(Math.min(100, Math.max(0, Number(item.impact) || 0)));
    return true;
  }).slice(0, 5);
  report.extractedFacts = { ...EMPTY_FACTS, ...(report.extractedFacts && typeof report.extractedFacts === "object" ? report.extractedFacts : {}) };
  report.extractedFacts.yearsExperience = Number.isFinite(Number(report.extractedFacts.yearsExperience))
    ? Number(report.extractedFacts.yearsExperience)
    : null;
  report.extractedFacts.noticePeriodDays = Number.isFinite(Number(report.extractedFacts.noticePeriodDays))
    ? Number(report.extractedFacts.noticePeriodDays)
    : null;
  report.followUpQuestions = Array.isArray(report.followUpQuestions) ? report.followUpQuestions.filter(Boolean).slice(0, 3) : [];
  report.recruiterSummary = typeof report.recruiterSummary === "string" && report.recruiterSummary.trim()
    ? report.recruiterSummary.trim()
    : "Manual review recommended.";
  report.confidence = Number.isFinite(Number(report.confidence)) && Number(report.confidence) >= 0 && Number(report.confidence) <= 1
    ? Number(report.confidence)
    : 0.5;
  report.sentiment = report.sentiment && typeof report.sentiment === "object" ? report.sentiment : {};
  report.sentiment.label = ["positive", "neutral", "negative"].includes(report.sentiment.label) ? report.sentiment.label : "neutral";
  report.sentiment.confidence = Number.isFinite(Number(report.sentiment.confidence)) && Number(report.sentiment.confidence) >= 0 && Number(report.sentiment.confidence) <= 1
    ? Number(report.sentiment.confidence)
    : 0.5;
  report.nextAction = typeof report.nextAction === "string" && report.nextAction.trim() ? report.nextAction.trim() : "manual_review";
  report.overallScore = overallScore;
  report.overallRecommendation = recommendation;
  report.reportVersion = "1.0";
  report.analysisStatus = "completed";

  return report;
}

export function buildDegradedReport(candidateId, screeningId, reason) {
  return {
    reportVersion: "1.0",
    analysisStatus: "failed",
    candidateId,
    screeningId,
    createdAt: new Date().toISOString(),
    role: { title: "Unknown", strategyId: "unknown" },
    language: null,
    overallRecommendation: "review",
    overallScore: null,
    confidence: 0,
    scores: Object.fromEntries(SCORE_KEYS.map((key) => [key, 0])),
    sentiment: { label: "neutral", confidence: 0 },
    strengths: [],
    risks: [],
    mustHavesMet: [],
    gaps: [],
    evidence: [],
    extractedFacts: { ...EMPTY_FACTS },
    followUpQuestions: [],
    nextAction: "manual_review",
    recruiterSummary: "Automated analysis could not be completed. Manual review required.",
    degradedReason: reason
  };
}
