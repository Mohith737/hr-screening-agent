import { Router } from "express";
import { all, get } from "../db.js";

const router = Router();

function parseJsonField(value) {
  return value ? JSON.parse(value) : null;
}

router.get("/candidates", async (_req, res) => {
  try {
    const candidates = await all(
      `SELECT *
       FROM candidates
       ORDER BY latest_overall_score IS NULL, latest_overall_score DESC`
    );

    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/candidates/:candidateId", async (req, res) => {
  try {
    const candidate = await get(
      "SELECT * FROM candidates WHERE id = ?",
      [req.params.candidateId]
    );

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const latestScreening = await get(
      `SELECT *
       FROM screenings
       WHERE candidate_id = ?
       ORDER BY started_at DESC
       LIMIT 1`,
      [req.params.candidateId]
    );

    if (latestScreening) {
      latestScreening.transcript_json = parseJsonField(latestScreening.transcript_json);
      latestScreening.analysis_report = parseJsonField(latestScreening.analysis_report);
    }

    return res.status(200).json({ candidate, latestScreening: latestScreening || null });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
