import { useEffect, useState } from 'react'
import { getScreening } from '../api'
import LoadingSpinner from './LoadingSpinner'

export default function TranscriptPanel({ screening }) {
  const [isOpen, setIsOpen] = useState(false)
  const [transcriptData, setTranscriptData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || transcriptData !== null) return

    let cancelled = false
    setLoading(true)
    getScreening(screening.id)
      .then((response) => {
        if (!cancelled) setTranscriptData(response.transcript || [])
      })
      .catch(() => {
        if (!cancelled) setTranscriptData([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isOpen, screening.id, transcriptData])

  const transcript = transcriptData || []

  return (
    <section className="card">
      <button className="btn btn-ghost transcript-toggle" onClick={() => setIsOpen(!isOpen)} type="button">
        {isOpen ? '▼ Hide Transcript' : '▶ View Transcript'}
      </button>
      {isOpen && (
        <div className="mt-12">
          {loading ? <LoadingSpinner /> : !screening.hasTranscript || transcript.length === 0 ? (
            <div className="text-secondary text-sm">No transcript available for this screening</div>
          ) : transcript.map((turn, index) => {
            const speaker = turn.speaker || turn.role || 'candidate'
            return (
              <div className={`transcript-turn ${speaker === 'agent' ? 'agent' : 'candidate'}`} key={`${speaker}-${index}`}>
                <div className="text-xs text-muted">{speaker}</div>
                <div className="transcript-bubble">{turn.text || turn.content || ''}</div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
