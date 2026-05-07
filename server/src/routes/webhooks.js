import { Router } from "express";
import { get, run } from "../db.js";
import { analyzeTranscript } from "../services/analysisService.js";

const router = Router();

router.post("/webhooks/bolna", async (req, res) => {
  const screeningId = req.body.user_data?.screening_id || req.query.screeningId;

  if (!screeningId) {
    return res.status(400).json({ error: "Missing screeningId" });
  }

  try {
    const screening = await get("SELECT * FROM screenings WHERE id = ?", [screeningId]);

    if (!screening) {
      return res.status(404).json({ error: "Screening not found" });
    }

    const transcript = req.body.transcript;
    const summary = req.body.summary;
    const normalizedTranscript = typeof transcript === "string"
      ? [{ speaker: "unknown", text: transcript }]
      : Array.isArray(transcript)
        ? transcript
        : [];

    await run(
      `UPDATE screenings
       SET status = ?, transcript_json = ?, provider_summary = ?, completed_at = ?
       WHERE id = ?`,
      [
        "completed",
        JSON.stringify(normalizedTranscript),
        summary || null,
        new Date().toISOString(),
        screeningId
      ]
    );

    const candidate = await get("SELECT * FROM candidates WHERE id = ?", [screening.candidate_id]);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    try {
      const report = await analyzeTranscript(candidate, transcript, screeningId);
      const completedAt = new Date().toISOString();

      await run(
        `UPDATE screenings
         SET analysis_report = ?, completed_at = ?
         WHERE id = ?`,
        [JSON.stringify(report), completedAt, screeningId]
      );

      await run(
        `UPDATE candidates
         SET latest_status = ?, latest_overall_score = ?, latest_recommendation = ?
         WHERE id = ?`,
        ["completed", report.overallScore, report.overallRecommendation, screening.candidate_id]
      );

      console.log(`[WEBHOOK] Analysis complete for ${screeningId}, score: ${report.overallScore}`);

      return res.status(200).json({ received: true, screeningId, score: report.overallScore });
    } catch (analysisError) {
      await run(
        `UPDATE screenings
         SET status = ?, analysis_report = ?, completed_at = ?
         WHERE id = ?`,
        ["completed", null, new Date().toISOString(), screeningId]
      );
      await run(
        `UPDATE candidates
         SET latest_status = ?, latest_overall_score = ?, latest_recommendation = ?
         WHERE id = ?`,
        ["completed", null, "review", screening.candidate_id]
      );

      return res.status(200).json({ received: true, screeningId, analysisError: true });
    }
  } catch (error) {
    if (screeningId) {
      return res.status(200).json({ received: true, screeningId, analysisError: true });
    }

    return res.status(400).json({ error: "Missing screeningId" });
  }
});

export default router;
