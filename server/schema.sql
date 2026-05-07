CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  language_preference TEXT DEFAULT 'English',
  applied_date TEXT,
  latest_status TEXT DEFAULT 'pending',
  latest_overall_score INTEGER,
  latest_recommendation TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS screenings (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL REFERENCES candidates(id),
  status TEXT DEFAULT 'initiated',
  bolna_call_id TEXT,
  transcript_json TEXT,
  provider_summary TEXT,
  analysis_report TEXT,
  started_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT
);
