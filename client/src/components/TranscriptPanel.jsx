import { useEffect, useState } from 'react'
import { getScreening } from '../api'
import EmptyState from './EmptyState'
import LoadingSpinner from './LoadingSpinner'
import TranscriptMessage from './TranscriptMessage'

export default function TranscriptPanel({ screening, intelligenceReport }) {
  const [isOpen, setIsOpen] = useState(false)
  const [turns, setTurns] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen || turns !== null || !screening?.id) return
    let cancelled = false
    setLoading(true)
    setError(null)
    getScreening(screening.id)
      .then((response) => {
        if (!cancelled) setTurns(response.transcript || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [isOpen, screening?.id, turns])

  const evidenceQuotes = intelligenceReport?.evidence
    ?.map((item) => item.quote?.toLowerCase().trim())
    .filter(Boolean) || []

  function isEvidenceMatch(text) {
    const normalized = (text || '').toLowerCase()
    return evidenceQuotes.some((quote) => normalized.includes(quote.substring(0, 40)))
  }

  return (
    <section className="card section">
      <button className="btn btn-ghost" onClick={() => setIsOpen(!isOpen)} type="button">
        {isOpen ? 'Hide Analyzed Transcript' : 'View Analyzed Transcript'}
      </button>
      {isOpen && (
        <div className="mt-12">
          {loading && (
            <div className="flex-col gap-12 items-center">
              <LoadingSpinner />
              <div className="meta">Loading interview conversation...</div>
            </div>
          )}
          {error && <EmptyState title={error} />}
          {!loading && !error && (!screening?.hasTranscript || !turns?.length) && (
            <EmptyState
              title="Transcript not available for this interview"
              subtitle="This may occur when a call ends early or the connection was interrupted."
            />
          )}
          {!loading && !error && turns?.length > 0 && (
            <>
              <div className="transcript-summary-row">
                <span>
                  Interview transcript • {turns.length} exchanges • {turns.filter((turn) => (turn.speaker || turn.role) !== 'agent').length} candidate responses analyzed
                </span>
              </div>
              <div className="transcript-container">
                {turns.map((turn, index) => (
                  <TranscriptMessage
                    key={`${turn.speaker || turn.role || 'candidate'}-${index}`}
                    turn={{ speaker: turn.speaker || turn.role || 'candidate', text: turn.text || turn.content || '' }}
                    isEvidenceMatch={isEvidenceMatch(turn.text || turn.content)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  )
}
