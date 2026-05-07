export const CANDIDATE_NOT_FOUND = "CANDIDATE_NOT_FOUND";
export const SCREENING_NOT_FOUND = "SCREENING_NOT_FOUND";
export const SCREENING_IN_PROGRESS = "SCREENING_IN_PROGRESS";
export const MISSING_PARAMETER = "MISSING_PARAMETER";
export const INTERNAL_ERROR = "INTERNAL_ERROR";

function isValidScore(score) {
  return Number.isFinite(score);
}

function normalizeCount(value) {
  return Number(value ?? 0);
}

export function formatDisplayStatus(dbStatus) {
  switch (dbStatus) {
    case "pending":
      return { code: "pending", label: "Waiting", color: "gray" };
    case "initiated":
      return { code: "screening", label: "Calling...", color: "blue" };
    case "screening":
      return { code: "screening", label: "In Progress", color: "blue" };
    case "completed":
      return { code: "completed", label: "Reviewed", color: "green" };
    case "failed":
      return { code: "failed", label: "Call Failed", color: "red" };
    default:
      return { code: "unknown", label: "Unknown", color: "gray" };
  }
}

export function formatRecommendationBadge(recommendation) {
  switch (recommendation) {
    case "advance":
      return { label: "Strong Fit", color: "green", icon: "check" };
    case "review":
      return { label: "Needs Review", color: "yellow", icon: "clock" };
    case "reject":
      return { label: "Not a Fit", color: "red", icon: "x" };
    default:
      return { label: "Pending", color: "gray", icon: "minus" };
  }
}

export function formatScoreDisplay(score) {
  const numericScore = Number(score);

  if (score == null || !isValidScore(numericScore)) {
    return { value: null, tier: "pending", color: "gray" };
  }

  if (numericScore >= 75) {
    return { value: numericScore, tier: "strong", color: "green" };
  }

  if (numericScore >= 50) {
    return { value: numericScore, tier: "average", color: "yellow" };
  }

  return { value: numericScore, tier: "weak", color: "red" };
}

export function formatLanguageBadge(languagePreference) {
  switch (languagePreference) {
    case "Hindi":
      return { label: "\u0939\u093f\u0902\u0926\u0940", color: "orange" };
    case "Hinglish":
      return { label: "Hinglish", color: "purple" };
    default:
      return { label: "English", color: "blue" };
  }
}

export function formatNextAction(code) {
  switch (code) {
    case "schedule_technical_round":
      return { code, label: "Schedule Technical Round" };
    case "schedule_hr_round":
      return { code, label: "Schedule HR Round" };
    case "send_offer":
      return { code, label: "Send Offer" };
    case "reject_candidate":
      return { code, label: "Reject Candidate" };
    default:
      return {
        code: "manual_review",
        label: "Manual Review Required"
      };
  }
}

export function formatDimensionScore(value) {
  return formatScoreDisplay(value);
}

export function formatCandidate(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    email: row.email,
    appliedDate: row.applied_date,
    languagePreference: row.language_preference,
    displayStatus: formatDisplayStatus(row.latest_status),
    scoreDisplay: formatScoreDisplay(row.latest_overall_score),
    recommendationBadge: formatRecommendationBadge(row.latest_recommendation),
    languageBadge: formatLanguageBadge(row.language_preference),
    canTriggerScreening:
      row.latest_status === "pending" || row.latest_status === "failed",
    hasIntelligenceReport:
      row.latest_overall_score !== null && row.latest_recommendation !== null
  };
}

export function formatIntelligenceReport(rawReport) {
  if (rawReport == null) {
    return null;
  }

  const rawScores = rawReport.scores || {};

  return {
    overallScore: rawReport.overallScore,
    overallRecommendation: rawReport.overallRecommendation,
    confidence: rawReport.confidence,
    recommendationBadge: formatRecommendationBadge(rawReport.overallRecommendation),
    scoreDisplay: formatScoreDisplay(rawReport.overallScore),
    scores: {
      roleFit: formatDimensionScore(rawScores.roleFit ?? null),
      communication: formatDimensionScore(rawScores.communication ?? null),
      experience: formatDimensionScore(rawScores.experience ?? null),
      intent: formatDimensionScore(rawScores.intent ?? null),
      problemSolving: formatDimensionScore(
        rawScores.problemSolving ?? rawScores.conversion ?? null
      )
    },
    sentiment: rawReport.sentiment,
    strengths: rawReport.strengths || [],
    risks: rawReport.risks || [],
    evidence: rawReport.evidence || [],
    extractedFacts: rawReport.extractedFacts || {},
    followUpQuestions: rawReport.followUpQuestions || [],
    recruiterSummary: rawReport.recruiterSummary || "No summary available.",
    nextAction: formatNextAction(rawReport.nextAction),
    analysisStatus: rawReport.analysisStatus || "completed",
    role: rawReport.role || null,
    createdAt: rawReport.createdAt || null,
    language: rawReport.language || rawReport.extractedFacts?.language || null
  };
}

export function formatLatestScreeningSummary(screening) {
  if (!screening) {
    return null;
  }

  return {
    id: screening.id,
    status: screening.status,
    startedAt: screening.started_at,
    completedAt: screening.completed_at || null,
    providerSummary: screening.provider_summary || null,
    hasTranscript: screening.transcript_json !== null,
    hasReport: screening.analysis_report !== null
  };
}

export function formatScreeningDetail(screening, transcript, report) {
  return {
    id: screening.id,
    candidateId: screening.candidate_id,
    status: screening.status,
    startedAt: screening.started_at,
    completedAt: screening.completed_at || null,
    providerSummary: screening.provider_summary || null,
    transcript,
    hasReport: report !== null,
    report
  };
}

export function formatDashboardPipeline(counts) {
  return {
    total: normalizeCount(counts?.total),
    pending: normalizeCount(counts?.pending),
    screening: normalizeCount(counts?.screening),
    completed: normalizeCount(counts?.completed),
    failed: normalizeCount(counts?.failed)
  };
}

export function formatDashboardTopCandidate(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    overallScore: row.latest_overall_score,
    recommendationBadge: formatRecommendationBadge(row.latest_recommendation),
    languageBadge: formatLanguageBadge(row.language_preference)
  };
}

export function formatDashboardActivity(row) {
  return {
    screeningId: row.screeningId,
    candidateName: row.candidateName,
    candidateRole: row.candidateRole,
    completedAt: row.completedAt,
    overallScore: row.overallScore,
    recommendation: row.recommendation,
    recommendationBadge: formatRecommendationBadge(row.recommendation)
  };
}

export function formatErrorResponse(code, message, status) {
  return {
    error: {
      code,
      message,
      status
    }
  };
}
