import { Router } from "express";
import { get, run } from "../db.js";
import { triggerScreeningCall } from "../bolna.js";
import {
  INTERNAL_ERROR,
  SCREENING_NOT_FOUND,
  formatErrorResponse,
  formatIntelligenceReport,
  formatScreeningDetail
} from "../formatters.js";

const router = Router();

function parseTranscriptField(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseReportField(value) {
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

router.post("/screenings", async (req, res) => {
  const { candidateId } = req.body;

  if (!candidateId) {
    return res.status(400).json({ error: "candidateId is required" });
  }

  let screeningId;
  let candidate;

  try {
    candidate = await get("SELECT * FROM candidates WHERE id = ?", [candidateId]);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    if (candidate.latest_status === "screening") {
      return res.status(409).json({ error: "Screening already in progress" });
    }

    screeningId = `scr_${Date.now()}`;

    await run(
      `INSERT INTO screenings (id, candidate_id, status, started_at)
       VALUES (?, ?, ?, ?)`,
      [screeningId, candidateId, "initiated", new Date().toISOString()]
    );

    await run(
      "UPDATE candidates SET latest_status = ? WHERE id = ?",
      ["screening", candidateId]
    );

    const response = await triggerScreeningCall(candidate, screeningId);

    await run(
      `UPDATE screenings
       SET status = ?, bolna_call_id = ?
       WHERE id = ?`,
      ["screening", response.bolnaCallId, screeningId]
    );

    return res.status(200).json({ screeningId, candidateId, status: "screening" });
  } catch (error) {
    if (screeningId) {
      await run(
        "UPDATE screenings SET status = ? WHERE id = ?",
        ["failed", screeningId]
      );
      await run(
        "UPDATE candidates SET latest_status = ? WHERE id = ?",
        ["failed", candidateId]
      );

      return res.status(200).json({
        screeningId,
        candidateId,
        status: "failed",
        error: error.message
      });
    }

    return res.status(500).json({ error: error.message });
  }
});

router.get("/screenings/:screeningId", async (req, res) => {
  try {
    const { screeningId } = req.params;
    const screening = await get(
      "SELECT * FROM screenings WHERE id = ?",
      [screeningId]
    );

    if (!screening) {
      return res.status(404).json(
        formatErrorResponse(
          SCREENING_NOT_FOUND,
          `No screening found with id: ${screeningId}`,
          404
        )
      );
    }

    const transcript = parseTranscriptField(screening.transcript_json);
    const report = formatIntelligenceReport(parseReportField(screening.analysis_report));

    return res.status(200).json(formatScreeningDetail(screening, transcript, report));
  } catch {
    return res
      .status(500)
      .json(formatErrorResponse(INTERNAL_ERROR, "Failed to load screening.", 500));
  }
});

export default router;
