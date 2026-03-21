import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab] = useState("candidates");

  useEffect(() => {
    async function loadCandidates() {
      const response = await fetch(`${API_URL}/api/candidates`);
      const data = await response.json();
      setCandidates(data);
    }

    loadCandidates();
  }, []);

  async function triggerCall(candidate) {
    setLoading(candidate.id);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/trigger-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ candidateId: candidate.id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to trigger call");
      }

      setCandidates((prev) =>
        prev.map((item) =>
          item.id === candidate.id ? { ...item, status: "screening" } : item
        )
      );
      setSelectedCandidate((prev) =>
        prev?.id === candidate.id ? { ...prev, status: "screening" } : prev
      );
    } catch (err) {
      setError(err.message || "Failed to trigger call");
    } finally {
      setLoading(null);
    }
  }

  async function fetchResults(candidateId) {
    try {
      const response = await fetch(
        `${API_URL}/api/results/${candidateId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("No results available yet");
      }

      setResults((prev) => ({ ...prev, [candidateId]: data }));
      setCandidates((prev) =>
        prev.map((item) =>
          item.id === candidateId && data.summary !== undefined
            ? { ...item, status: "completed" }
            : item
        )
      );
      setSelectedCandidate((prev) =>
        prev?.id === candidateId && data.summary !== undefined
          ? { ...prev, status: "completed" }
          : prev
      );
    } catch (_err) {
      setResults((prev) => ({
        ...prev,
        [candidateId]: { error: "No results available yet" }
      }));
    }
  }

  return (
    <div className="app" data-tab={activeTab}>
      <div className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🎯 HR Screening</h1>
            <p>AI-powered candidate screening</p>
          </div>
          <div className="stats-bar">
            <span>{candidates.filter((c) => c.status === "pending").length} Pending</span>
            <span>{candidates.filter((c) => c.status === "screening").length} Screening</span>
            <span>{candidates.filter((c) => c.status === "completed").length} Completed</span>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="candidates-panel">
          <h2>Candidates ({candidates.length})</h2>
          {candidates.map((c) => (
            <div
              key={c.id}
              className={`candidate-card ${selectedCandidate?.id === c.id ? "selected" : ""}`}
              onClick={() => setSelectedCandidate(c)}
            >
              <div className="candidate-info">
                <div className="candidate-name">{c.name}</div>
                <div className="candidate-role">{c.role}</div>
                <div className="candidate-meta">
                  {c.email} and {c.appliedDate}
                </div>
              </div>
              <div className="candidate-actions">
                <span className={`status-badge status-${c.status}`}>
                  {c.status.toUpperCase()}
                </span>

                {c.status === "pending" && (
                  <button
                    className="btn-trigger"
                    disabled={loading === c.id}
                    onClick={() => triggerCall(c)}
                  >
                    {loading === c.id ? "Calling..." : "📞 Start Screening"}
                  </button>
                )}

                {c.status === "screening" && (
                  <button
                    className="btn-results"
                    onClick={() => {
                      fetchResults(c.id);
                      setSelectedCandidate(c);
                    }}
                  >
                    📋 Get Results
                  </button>
                )}

                {c.status === "completed" && (
                  <button
                    className="btn-view"
                    onClick={() => setSelectedCandidate(c)}
                  >
                    {" "}View Report
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="detail-panel">
          {selectedCandidate === null ? (
            <div className="empty-state">
              <p>👈 Select a candidate to view details</p>
            </div>
          ) : (
            <div className="detail-content">
              <div>
                <h2>{selectedCandidate.name}</h2>
                <p>{selectedCandidate.role}</p>
                <span className={`status-badge status-${selectedCandidate.status}`}>
                  {selectedCandidate.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3>Contact Information</h3>
                <p>📧 {selectedCandidate.email}</p>
                <p>📱 {selectedCandidate.phone}</p>
                <p>📅 Applied: {selectedCandidate.appliedDate}</p>
              </div>

              <div className="agent-test-section">
                <h3>Voice Screening</h3>
                <p>Test the AI screening agent directly in your browser</p>
                <button
                  className="btn-bolna"
                  onClick={() =>
                    window.open(
                      "https://app.bolna.dev/test-agent/ab272a30-9405-4c18-8297-173a0eeac823",
                      "_blank"
                    )
                  }
                >
                  🎙 Test Agent in Browser
                </button>
              </div>

              {results[selectedCandidate.id] && (
                <div className="results-section">
                  <h3>Screening Results</h3>

                  {results[selectedCandidate.id].error ? (
                    <p className="no-results">{results[selectedCandidate.id].error}</p>
                  ) : (
                    <>
                      <div className="result-card">
                        <h4>Summary</h4>
                        <p>
                          {results[selectedCandidate.id].summary || "No summary available"}
                        </p>
                      </div>

                      {Array.isArray(results[selectedCandidate.id].transcript) &&
                        results[selectedCandidate.id].transcript.length > 0 && (
                          <div className="transcript-section">
                            <h4>Call Transcript</h4>
                            {results[selectedCandidate.id].transcript.map((item, index) => (
                              <div key={index} className="transcript-item">
                                <span className="speaker">
                                  {item.role || item.speaker}
                                </span>
                                <span className="transcript-text">
                                  {item.text || item.content}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error !== null && (
        <div className="error-toast">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
}
