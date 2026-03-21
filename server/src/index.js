import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();

import cors from "cors";
import express from "express";
import { triggerScreeningCall } from "./bolna.js";
import { candidates, screeningResults } from "./store.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/candidates", (_req, res) => {
  res.json(Array.from(candidates.values()));
});

app.post("/api/trigger-call", async (req, res) => {
  const candidateId = req.body.candidateId;

  if (!candidateId) {
    return res.status(400).json({ error: "candidateId is required" });
  }

  const candidate = candidates.get(candidateId);

  if (!candidate) {
    return res.status(404).json({ error: "Candidate not found" });
  }

  if (candidate.status === "screening" || candidate.status === "completed") {
    return res.status(400).json({
      error: "Screening already initiated for this candidate"
    });
  }

  try {
    const response = await triggerScreeningCall(candidate);

    candidates.set(candidateId, { ...candidate, status: "screening" });
    screeningResults.set(candidateId, response);

    return res.json({ success: true, candidateId, callData: response });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/webhook", (req, res) => {
  const candidateId = req.body.user_data?.candidateId || req.query.candidateId;
  const transcript = req.body.transcript || [];
  const summary = req.body.summary || "";

  if (candidateId) {
    const candidate = candidates.get(candidateId);

    if (candidate) {
      candidates.set(candidateId, { ...candidate, status: "completed" });
    }

    screeningResults.set(candidateId, {
      candidateId,
      transcript,
      summary,
      completedAt: new Date()
    });
  }

  res.json({ received: true });
});

app.get("/api/results/:candidateId", (req, res) => {
  const result = screeningResults.get(req.params.candidateId);

  if (!result) {
    return res.status(404).json({ error: "No results found" });
  }

  return res.json(result);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
