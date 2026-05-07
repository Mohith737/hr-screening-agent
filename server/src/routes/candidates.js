import { Router } from "express";
import { all, get } from "../db.js";
import {
  CANDIDATE_NOT_FOUND,
  INTERNAL_ERROR,
  formatCandidate,
  formatErrorResponse,
  formatIntelligenceReport,
  formatLatestScreeningSummary
} from "../formatters.js";

const router = Router();

function parseJsonField(value) {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

router.get("/candidates", async (_req, res) => {
  try {
    const candidates = await all(
      `SELECT *
       FROM candidates
       ORDER BY
         CASE WHEN latest_overall_score IS NULL THEN 1 ELSE 0 END,
         latest_overall_score DESC,
         applied_date ASC`
    );

    res.status(200).json(candidates.map((row) => formatCandidate(row)));
  } catch {
    res
      .status(500)
      .json(formatErrorResponse(INTERNAL_ERROR, "Failed to load candidates.", 500));
  }
});

router.get("/candidates/:candidateId", async (req, res) => {
  try {
    const { candidateId } = req.params;
    const candidate = await get(
      "SELECT * FROM candidates WHERE id = ?",
      [candidateId]
    );

    if (!candidate) {
      return res.status(404).json(
        formatErrorResponse(
          CANDIDATE_NOT_FOUND,
          `No candidate found with id: ${candidateId}`,
          404
        )
      );
    }

    const latestScreening = await get(
      `SELECT *
       FROM screenings
       WHERE candidate_id = ?
       ORDER BY started_at DESC
       LIMIT 1`,
      [candidateId]
    );

    const parsedReport = parseJsonField(latestScreening?.analysis_report);

    return res.status(200).json({
      candidate: formatCandidate(candidate),
      latestScreening: formatLatestScreeningSummary(latestScreening),
      intelligenceReport: formatIntelligenceReport(parsedReport)
    });
  } catch {
    return res
      .status(500)
      .json(formatErrorResponse(INTERNAL_ERROR, "Failed to load candidate details.", 500));
  }
});

export default router;
