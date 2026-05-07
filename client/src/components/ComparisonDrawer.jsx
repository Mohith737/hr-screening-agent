import { useEffect, useState } from 'react'
import { getCandidate } from '../api'
import DimensionBar from './DimensionBar'
import LoadingSpinner from './LoadingSpinner'
import ScoreBadge from './ScoreBadge'

const dimensions = {
  roleFit: 'Role Fit',
  communication: 'Communication',
  experience: 'Experience',
  intent: 'Intent',
  problemSolving: 'Problem Solving',
}
function fact(report, key) {
  const facts = report?.extractedFacts || {}
  if (key === 'experience') return facts.yearsExperience ? `${facts.yearsExperience} years` : '-'
  if (key === 'notice') return facts.noticePeriodDays ? `${facts.noticePeriodDays} days` : '-'
  if (key === 'language') return report?.language || facts.language || '-'
  if (key === 'salary') return facts.salaryExpectation || '-'
  return facts.location || '-'
}

function generateComparisonInsight(candidates) {
  if (candidates.length === 0) return 'Profile unavailable'
  if (candidates.length === 1) return `${candidates[0].candidate?.name || 'This candidate'} profile is available. Review the loaded profile while unavailable candidates are retried.`
  const sorted = [...candidates].sort((a, b) =>
    (b.intelligenceReport?.overallScore ?? 0) - (a.intelligenceReport?.overallScore ?? 0))
  const top = sorted[0]
  const second = sorted[1]
  const topName = top?.candidate?.name || 'The highest-ranked candidate'
  const topScore = top?.intelligenceReport?.overallScore ?? '-'
  const topStrength = top?.intelligenceReport?.strengths?.[0] || 'strong interview evidence'
  const secondName = second?.candidate?.name || 'The comparison candidate'
  const secondRisk = second?.intelligenceReport?.risks?.[0] || second?.intelligenceReport?.strengths?.[0] || 'a different tradeoff profile'
  const recommendations = candidates.map((item) => item.intelligenceReport?.overallRecommendation)

  if (recommendations.includes('advance') && recommendations.some((item) => item !== 'advance')) {
    return `HireIQ recommends advancing ${topName} based on ${topScore}/100 overall score and transcript-grounded evidence. The other candidate(s) require further review before a decision.`
  }
  if (new Set(recommendations).size === 1) return `Both candidates share a ${recommendations[0] || 'review'} recommendation. Review dimension scores and evidence to identify the stronger fit for your team.`
  return `Based on interview intelligence, ${topName} scores highest overall (${topScore}/100) with notable strengths in ${topStrength}. ${secondName} presents ${secondRisk}.`
}

export default function ComparisonDrawer({ candidateIds, onClose }) {
  const [candidates, setCandidates] = useState([])
  const [failedProfiles, setFailedProfiles] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.allSettled(candidateIds.map((id) => getCandidate(id)))
      .then((results) => {
        if (cancelled) return
        setCandidates(results.filter((result) => result.status === 'fulfilled').map((result) => result.value))
        setFailedProfiles(results.filter((result) => result.status === 'rejected').length)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [candidateIds])

  return (
    <div className="comparison-overlay" onClick={onClose}><aside className="comparison-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between mb-24">
          <div>
            <h2 className="heading-1">Candidate Comparison</h2>
            <div className="text-secondary">{candidates[0]?.candidate?.role || 'Role pipeline'}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} type="button">x</button>
        </div>
        {loading ? (
          <div className="center-panel flex-col gap-12">
            <LoadingSpinner />
            <div className="meta">Preparing comparison...</div>
          </div>
        ) : (
          <>
            {failedProfiles > 0 && (
              <div className="meta mb-16">Profile unavailable</div>
            )}
            <section className="card section">
              <p className="section-label">Overall Scores</p>
              <div className="comparison-grid">
                {candidates.map((item) => <div className="flex-col gap-8" key={item.candidate.id}>
                  <strong>{item.candidate.name || 'Unnamed candidate'}</strong>
                  <ScoreBadge scoreDisplay={item.intelligenceReport?.scoreDisplay} size="large" />
                  <span className={`badge badge-${item.intelligenceReport?.recommendationBadge?.color || 'gray'}`}>{item.intelligenceReport?.recommendationBadge?.label || 'Pending'}</span>
                </div>)}
              </div>
            </section>
            <section className="card section" style={{ background: 'var(--blue-bg)', border: '1px solid var(--blue)' }}>
              <div className="section-label">AI Comparison Insight</div>
              <div className="text-sm text-secondary">{generateComparisonInsight(candidates)}</div>
            </section>
            <section className="card section">
              <p className="section-label">Dimension Comparison</p>
              {Object.entries(dimensions).map(([key, label]) => <div key={key} className="mb-16">
                <div className="font-semibold mb-8">{label}</div>
                <div className="comparison-grid">
                  {candidates.map((item) => <DimensionBar key={`${item.candidate.id}-${key}`} label={item.candidate.name} scoreObj={item.intelligenceReport?.scores?.[key]} />)}
                </div>
              </div>)}
            </section>
            <section className="card section">
              <p className="section-label">Strengths / Risks Diff</p>
              <div className="comparison-grid">
                {candidates.map((item) => <div key={item.candidate.id}>
                  <strong>{item.candidate.name || 'Unnamed candidate'}</strong>
                  <ul className="mt-8 text-sm text-secondary">{(item.intelligenceReport?.strengths || []).map((strength) => <li key={strength}>+ {strength}</li>)}</ul>
                  <ul className="mt-8 text-sm text-secondary">{(item.intelligenceReport?.risks || []).map((risk) => <li key={risk}>- {risk}</li>)}</ul>
                </div>)}
              </div>
            </section>
            <section className="card section">
              <p className="section-label">Facts Table</p>
              <table className="comparison-table">
                <tbody>
                  {['experience', 'location', 'notice', 'language', 'salary'].map((row) => <tr key={row}>
                    <th>{row}</th>
                    {candidates.map((item) => <td key={`${item.candidate.id}-${row}`}>{fact(item.intelligenceReport, row)}</td>)}
                  </tr>)}
                </tbody>
              </table>
            </section>
            <section className="card section">
              <p className="section-label">Recruiter Summary</p>
              {candidates.map((item) => <blockquote className="decision-zone-summary" key={item.candidate.id}>
                {item.intelligenceReport?.recruiterSummary || 'Interview summary not yet available.'}
              </blockquote>)}
            </section>
          </>
        )}
      </aside></div>
  )
}
