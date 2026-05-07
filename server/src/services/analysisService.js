import Groq from "groq-sdk";
import { ANALYSIS_SCHEMA_DESCRIPTION, buildDegradedReport, validateAndNormalize } from "../schemas/analysisReport.js";
import { getStrategy } from "./strategyService.js";

const SCORE_KEYS = ["roleFit", "communication", "experience", "intent", "problemSolving"];

function normalizeTranscript(rawTranscript) {
  const transcript = rawTranscript == null
    ? [{ speaker: "unknown", text: "No transcript available" }]
    : typeof rawTranscript === "string"
      ? [{ speaker: "unknown", text: rawTranscript }]
      : Array.isArray(rawTranscript)
        ? rawTranscript.map((turn) => {
            if (turn && typeof turn === "object") {
              if ("text" in turn) return { speaker: turn.speaker || turn.role || "unknown", text: turn.text };
              if ("content" in turn) return { speaker: turn.role || turn.speaker || "unknown", text: turn.content };
              if ("message" in turn) return { speaker: turn.speaker || "unknown", text: turn.message };
            }
            return { speaker: "unknown", text: "" };
          })
        : [{ speaker: "unknown", text: "No transcript available" }];

  return transcript.filter((turn) => String(turn?.text || "").trim()).map((turn) => ({
    speaker: String(turn.speaker || "unknown"),
    text: String(turn.text).trim()
  }));
}

function detectLanguage(turns) {
  const candidateText = turns
    .filter((turn) => String(turn.speaker || "").toLowerCase() !== "agent")
    .map((turn) => turn.text)
    .join(" ");
  const normalizedText = candidateText.toLowerCase();
  const markers = ["yaar", "haan", "nahi", "theek", "acha", "matlab", "bas", "kar", "hai", "kya"];
  const markerCount = markers.filter((marker) => new RegExp(`\\b${marker}\\b`, "i").test(normalizedText)).length;

  if (/[\u0900-\u097F]/.test(candidateText)) return "Hindi";
  if (markerCount >= 2) return "Hinglish";
  return "English";
}

function buildPrompt(candidate, turns, strategy, detectedLanguage) {
  const systemPrompt = "You are a structured candidate evaluation engine for a recruiting platform. Your only job is to analyze interview transcripts and return a precise JSON evaluation. You do not chat, explain, or add commentary. You return only valid JSON matching the exact schema provided. No markdown. No preamble. No extra keys.";
  const transcriptSection = turns.map((turn) => {
    const label = String(turn.speaker || "").toLowerCase() === "agent" ? "[AGENT]" : "[CANDIDATE]";
    return `${label}: ${turn.text}`;
  }).join("\n");
  const userPrompt = [
    `SECTION 1 — ROLE CONTEXT\nROLE BEING EVALUATED: ${strategy.roleTitle}\nMUST-HAVE SKILLS: ${strategy.mustHaves.join(", ")}\nEVALUATION RUBRIC: ${strategy.rubricHints}`,
    `SECTION 2 — CANDIDATE CONTEXT\nCANDIDATE: ${candidate.name}\nINTERVIEW LANGUAGE: ${detectedLanguage}\nNOTE: Evaluate based on substance, not language fluency. A candidate answering in Hindi or Hinglish should be judged on the quality of their answers, not their English proficiency.`,
    `SECTION 3 — TRANSCRIPT\n${transcriptSection}`,
    `SECTION 4 — SCHEMA INSTRUCTIONS\n${ANALYSIS_SCHEMA_DESCRIPTION}\nCRITICAL RULES:\n1. Every evidence quote MUST be copied verbatim from the transcript above. Do not paraphrase. Do not invent.\n2. Scores are integers 0-100.\n3. Confidence values are decimals 0.0 to 1.0.\n4. overallRecommendation must be exactly one of:\n   advance, review, reject.\n5. Return ONLY the JSON object. No other text.`
  ].join("\n\n");

  return { systemPrompt, userPrompt };
}

async function callGroq(systemPrompt, userPrompt) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.1,
    max_tokens: 1200,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });
  const content = response.choices[0]?.message?.content || "";

  try {
    return JSON.parse(content.replace(/```json/g, "").replace(/```/g, "").trim());
  } catch {
    throw new Error("JSON_PARSE_FAILED");
  }
}

function clampScore(value) {
  const score = Number(value);
  return Math.min(100, Math.max(0, Number.isFinite(score) ? score : 50));
}

function computeScores(rawScores, strategy) {
  const scores = Object.fromEntries(SCORE_KEYS.map((key) => [key, clampScore(rawScores?.[key])]));
  const overallScore = Math.round(
    (scores.roleFit * strategy.weights.roleFit) +
    (scores.communication * strategy.weights.communication) +
    (scores.experience * strategy.weights.experience) +
    (scores.intent * strategy.weights.intent) +
    (scores.problemSolving * strategy.weights.problemSolving)
  );
  const recommendation = overallScore >= 75 ? "advance" : overallScore >= 50 ? "review" : "reject";

  return { scores, overallScore, recommendation };
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzeTranscript(candidate, rawTranscript, screeningId) {
  console.log(`[ANALYSIS] Starting analysis for ${screeningId}`);

  try {
    const turns = normalizeTranscript(rawTranscript);
    console.log(`[ANALYSIS] Transcript normalized, ${turns.length} turns`);
    const detectedLanguage = detectLanguage(turns);
    console.log(`[ANALYSIS] Language detected: ${detectedLanguage}`);
    const strategy = getStrategy(candidate.role);
    console.log(`[ANALYSIS] Strategy selected: ${strategy.strategyId}`);
    const { systemPrompt, userPrompt } = buildPrompt(candidate, turns, strategy, detectedLanguage);
    let rawReport;

    try {
      rawReport = await callGroq(systemPrompt, userPrompt);
    } catch {
      await wait(1000);
      rawReport = await callGroq(systemPrompt, userPrompt);
    }

    console.log("[ANALYSIS] Groq call complete");
    const { scores, overallScore, recommendation } = computeScores(rawReport?.scores, strategy);
    console.log(`[ANALYSIS] Score computed: ${overallScore}, recommendation: ${recommendation}`);
    const report = validateAndNormalize({ ...rawReport, scores }, turns, overallScore, recommendation);
    Object.assign(report, {
      reportVersion: "1.0",
      candidateId: candidate.id,
      screeningId,
      createdAt: new Date().toISOString(),
      role: { title: strategy.roleTitle, strategyId: strategy.strategyId },
      language: detectedLanguage
    });
    console.log("[ANALYSIS] Report validated and complete");
    return report;
  } catch (error) {
    console.error(`[ANALYSIS] Failed for ${screeningId}:`, error.message);
    return buildDegradedReport(candidate.id, screeningId, error.message);
  }
}
