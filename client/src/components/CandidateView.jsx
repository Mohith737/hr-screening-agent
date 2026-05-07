import { useEffect, useState } from 'react'
import { getCandidate } from '../api'
import CandidateHeader from './CandidateHeader'
import RecruiterActions from './RecruiterActions'
import AnalysisScorecard from './AnalysisScorecard'
import EmptyState from './EmptyState'
import LoadingSpinner from './LoadingSpinner'
import TranscriptPanel from './TranscriptPanel'

export default function CandidateView({ candidateId, triggeringId, onStartScreening }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getCandidate(candidateId)
      .then((data) => {
        if (!cancelled) setDetail(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [candidateId])

  useEffect(() => {
    if (detail?.candidate?.displayStatus?.code !== 'screening') return

    const intervalId = setInterval(async () => {
      try {
        const data = await getCandidate(candidateId)
        setDetail(data)
        if (data.candidate?.displayStatus?.code === 'completed') clearInterval(intervalId)
      } catch (err) {
        setError(err.message)
      }
    }, 10000)

    return () => clearInterval(intervalId)
  }, [candidateId, detail?.candidate?.displayStatus?.code])

  if (loading) return <div className="center-panel"><LoadingSpinner /></div>
  if (error) return <EmptyState title={error} />
  if (!detail) return <EmptyState title="Candidate details unavailable" />

  return (
    <div>
      <CandidateHeader candidate={detail.candidate} />
      <RecruiterActions
        candidate={detail.candidate}
        isTriggering={triggeringId === candidateId}
        onStart={() => onStartScreening(candidateId)}
      />
      {detail.intelligenceReport ? (
        <AnalysisScorecard report={detail.intelligenceReport} />
      ) : (
        <EmptyState
          title="No screening results yet"
          subtitle="Start a screening call to generate candidate intelligence."
        />
      )}
      {detail.latestScreening && <TranscriptPanel screening={detail.latestScreening} />}
    </div>
  )
}
