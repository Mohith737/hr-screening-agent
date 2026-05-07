import "dotenv/config";
import cors from "cors";
import express from "express";
import db from "./db.js";
import candidatesRouter from "./routes/candidates.js";
import dashboardRouter from "./routes/dashboard.js";
import screeningsRouter from "./routes/screenings.js";
import webhooksRouter from "./routes/webhooks.js";

const app = express();
const port = process.env.PORT || 3001;
void db;

app.use(cors());
app.use(express.json());
app.use("/api", candidatesRouter);
app.use("/api", dashboardRouter);
app.use("/api", screeningsRouter);
app.use("/api", webhooksRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
