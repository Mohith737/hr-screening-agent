import { Router } from "express";
import { all, get } from "../db.js";
import {
  INTERNAL_ERROR,
  formatDashboardActivity,
  formatDashboardPipeline,
  formatDashboardTopCandidate,
  formatErrorResponse
} from "../formatters.js";

const router = Router();

router.get("/dashboard/summary", async (_req, res) => {
  try {
    const [counts, topCandidates, recentActivity, avgScore, advanceStats] = await Promise.all([
      get(
        `SELECT
           COUNT(*) as total,
           SUM(CASE WHEN latest_status = 'pending' THEN 1 ELSE 0 END) as pending,
           SUM(CASE WHEN latest_status IN ('initiated','screening') THEN 1 ELSE 0 END) as screening,
           SUM(CASE WHEN latest_status = 'completed' THEN 1 ELSE 0 END) as completed,
           SUM(CASE WHEN latest_status = 'failed' THEN 1 ELSE 0 END) as failed
         FROM candidates`
      ),
      all(
        `SELECT id, name, role, language_preference,
                latest_overall_score, latest_recommendation
         FROM candidates
         WHERE latest_status = 'completed'
           AND latest_overall_score IS NOT NULL
         ORDER BY latest_overall_score DESC
         LIMIT 3`
      ),
      all(
        `SELECT s.id as screeningId, c.name as candidateName,
                c.role as candidateRole,
                s.completed_at as completedAt,
                c.latest_overall_score as overallScore,
                c.latest_recommendation as recommendation
         FROM screenings s
         JOIN candidates c ON c.id = s.candidate_id
         WHERE s.status = 'completed'
         ORDER BY s.completed_at DESC
         LIMIT 5`
      ),
      get(
        `SELECT AVG(latest_overall_score) as avgScore
         FROM candidates
         WHERE latest_overall_score IS NOT NULL`
      ),
      get(
        `SELECT
           COUNT(*) as totalCompleted,
           SUM(CASE WHEN latest_recommendation = 'advance' THEN 1 ELSE 0 END) as advanceCount
         FROM candidates
         WHERE latest_status = 'completed'`
      )
    ]);

    const totalCompleted = Number(advanceStats?.totalCompleted ?? 0);
    const advanceCount = Number(advanceStats?.advanceCount ?? 0);

    return res.status(200).json({
      pipeline: formatDashboardPipeline(counts),
      topCandidates: topCandidates.map((row) => formatDashboardTopCandidate(row)),
      recentActivity: recentActivity.map((row) => formatDashboardActivity(row)),
      averageScore: avgScore?.avgScore != null ? Math.round(avgScore.avgScore) : null,
      advanceRate:
        totalCompleted > 0 ? Number((advanceCount / totalCompleted).toFixed(2)) : null
    });
  } catch {
    return res
      .status(500)
      .json(formatErrorResponse(INTERNAL_ERROR, "Failed to load dashboard summary.", 500));
  }
});

export default router;
