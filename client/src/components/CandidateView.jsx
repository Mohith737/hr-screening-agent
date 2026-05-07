import { useEffect, useState } from 'react'
import { getCandidate } from '../api'
import DecisionZone from './DecisionZone'
import DimensionBar from './DimensionBar'
import EmptyState from './EmptyState'
import EvidencePanel from './EvidencePanel'
import ExtractedFacts from './ExtractedFacts'
import FollowUpPanel from './FollowUpPanel'
import LoadingSpinner from './LoadingSpinner'
import StrengthsRisks from './StrengthsRisks'
import TranscriptPanel from './TranscriptPanel'

const dimensionLabels = {
  roleFit: 'Role Fit',
  communication: 'Communication',
  experience: 'Experience',
  intent: 'Intent',
  problemSolving: 'Problem Solving',
}

export default function CandidateView({ candidateId, triggeringId, onStartScreening, allCandidates = [] }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getCandidate(candidateId)
      .then((data) => {
        if (cancelled) return
        setDetail(data)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [candidateId])

  useEffect(() => {
    if (detail?.candidate?.displayStatus?.code !== 'screening') return
    const intervalId = setInterval(async () => {
      try {
        const data = await getCandidate(candidateId)
        setDetail(data)
        if (data.candidate?.displayStatus?.code !== 'screening') clearInterval(intervalId)
      } catch (err) {
        setError(err.message)
      }
    }, 10000)
    return () => clearInterval(intervalId)
  }, [candidateId, detail?.candidate?.displayStatus?.code])

  if (loading && !detail) {
    return (
      <div className="center-panel flex-col gap-12">
        <LoadingSpinner />
        <div className="meta">Preparing candidate profile...</div>
      </div>
    )
  }
  const readableError = error && /fetch failed|failed to fetch|network error|networkerror/i.test(error)
    ? 'Unable to load candidate profile. Please refresh and try again.'
    : error
  if (error) return <EmptyState title={readableError} />
  if (!detail) return <EmptyState title="Candidate details unavailable" />

  const report = detail.intelligenceReport

  return (
    <div
      className="candidate-detail-panel"
      style={loading ? { opacity: 0.55, pointerEvents: 'none', transition: 'opacity 0.15s ease' } : { opacity: 1, transition: 'opacity 0.2s ease' }}
    >
      <DecisionZone
        candidate={detail.candidate}
        report={report}
        isTriggering={triggeringId === candidateId}
        onStartScreening={() => onStartScreening(candidateId)}
        allCandidates={allCandidates}
      />
      {report && (
        <>
          <div className="grid-2 section">
            <section className="card"><StrengthsRisks strengths={report.strengths} risks={report.risks} /></section>
            <section className="card"><EvidencePanel evidence={report.evidence} /></section>
          </div>
          <div className="card section">
            <p className="section-label">Dimension Scores</p>
            <div className="dimension-bars-container">
              {Object.entries(dimensionLabels).map(([key, label]) => (
                <DimensionBar key={key} label={label} scoreObj={report.scores[key]} />
              ))}
            </div>
          </div>
          <div className="grid-2 section">
            <section className="card">
              <ExtractedFacts extractedFacts={report.extractedFacts} language={report.language} />
            </section>
            <section className="card">
              <FollowUpPanel followUpQuestions={report.followUpQuestions} />
            </section>
          </div>
        </>
      )}
      <TranscriptPanel screening={detail.latestScreening} intelligenceReport={report} />
    </div>
  )
}
