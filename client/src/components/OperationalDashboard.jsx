import { useMemo } from 'react'
import EmptyState from './EmptyState'
import LoadingSpinner from './LoadingSpinner'
import ScoreBadge from './ScoreBadge'

function daysSince(value) {
  if (!value) return 0
  return Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
}

function formatTimeAgo(value) {
  if (!value) return 'just now'
  const diff = Date.now() - new Date(value).getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(hours / 24)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function OperationalDashboard({ data, candidates, onSelectCandidate }) {
  const roleHealth = useMemo(() => {
    const groups = {}
    candidates.forEach((candidate) => {
      if (!groups[candidate.role]) groups[candidate.role] = []
      groups[candidate.role].push(candidate)
    })
    return Object.entries(groups).map(([role, items]) => {
      const scored = items.filter((candidate) => candidate.scoreDisplay?.value !== null)
      const avg = scored.length
        ? Math.round(scored.reduce((sum, candidate) => sum + candidate.scoreDisplay.value, 0) / scored.length)
        : '-'
      return {
        role,
        total: items.length,
        interviewed: items.filter((candidate) => candidate.displayStatus?.code === 'completed').length,
        pending: items.filter((candidate) => candidate.displayStatus?.code === 'pending').length,
        avg,
      }
    })
  }, [candidates])

  if (data === null || candidates.length === 0) {
    return (
      <div className="center-panel flex-col gap-12">
        <LoadingSpinner />
        <div className="meta">Loading pipeline intelligence...</div>
      </div>
    )
  }

  const pipeline = data.pipeline || {}
  const advancing = candidates.filter((candidate) => candidate.recommendationBadge?.color === 'green')
  const attention = candidates.filter((candidate) =>
    candidate.displayStatus?.code === 'failed' || (candidate.canTriggerScreening && daysSince(candidate.appliedDate) >= 3))
  const recentActivity = data.recentActivity || []

  return (
    <div>
      <div className="metric-strip">
        <div className="metric-block"><div className="metric-number">{pipeline.total ?? 0}</div><div className="metric-label">Total Candidates</div></div>
        <div className="metric-block"><div className={`metric-number ${pipeline.completed > 0 ? 'text-green' : ''}`}>{pipeline.completed ?? 0}</div><div className="metric-label">Interviewed</div></div>
        <div className="metric-block"><div className={`metric-number ${pipeline.screening > 0 ? 'text-blue' : ''}`}>{pipeline.screening ?? 0}</div><div className="metric-label">In Progress</div></div>
        <div className="metric-block"><div className="metric-number text-green">{advancing.length}</div><div className="metric-label">Advancing</div></div>
        <div className="metric-block"><div className="metric-number">{data.averageScore || '-'}</div><div className="metric-label">Avg Score</div></div>
      </div>
      <div className="meta" style={{ textAlign: 'center', padding: '0 0 20px' }}>
        AI-powered recruiter intelligence - prioritize faster, decide with confidence.
      </div>
      <section className="attention-zone section">
        <p className="section-label">Requires Recruiter Action</p>
        {attention.length === 0 ? <div className="text-green font-semibold">Your pipeline is on track - no urgent actions needed</div> : (
          <div className="grid-3">
            {attention.map((candidate) => (
              <button className="compact-action-card card-clickable" key={candidate.id} onClick={() => onSelectCandidate(candidate.id)} type="button">
                <div className="font-semibold">{candidate.name || 'Unnamed candidate'}</div>
                <div className="text-sm text-secondary">{candidate.role || 'Role unavailable'}</div>
                <div className="text-red text-sm mt-8">{candidate.displayStatus?.code === 'failed' ? 'Interview call failed - Retry interview call' : 'Not yet interviewed'}</div>
              </button>
            ))}
          </div>
        )}
      </section>
      <section className="advance-zone section">
        <p className="section-label">Ready to Advance</p>
        {advancing.length === 0 ? <div className="text-secondary">Complete more interviews to surface advancement candidates</div> : (
          <div className="grid-3">
            {[...advancing]
              .sort((a, b) => (b.scoreDisplay?.value ?? 0) - (a.scoreDisplay?.value ?? 0))
              .map((candidate) => (
                <button className="compact-action-card card-clickable" key={candidate.id} onClick={() => onSelectCandidate(candidate.id)} type="button">
                  <div className="flex items-center justify-between gap-12 mb-8">
                    <div><div className="font-semibold">{candidate.name || 'Unnamed candidate'}</div><div className="text-sm text-secondary">{candidate.role || 'Role unavailable'}</div></div>
                    <ScoreBadge scoreDisplay={candidate.scoreDisplay} size="compact" />
                  </div>
                  <span className={`badge badge-${candidate.recommendationBadge?.color || 'gray'}`}>{candidate.recommendationBadge?.label || 'Pending'}</span>
                  <div className="text-sm text-secondary mt-8">Open candidate decision</div>
                </button>
              ))}
          </div>
        )}
      </section>
      <section className="card section">
        <p className="section-label">Role Pipeline Health</p>
        {roleHealth.map((role) => (
          <div className="flex items-center justify-between divider" key={role.role}>
            <strong>{role.role}</strong>
            <span className="text-secondary">{role.interviewed}/{role.total} interviewed</span>
            <span className="text-secondary">Avg {role.avg}</span>
            <span className="text-secondary">{role.pending} pending</span>
          </div>
        ))}
      </section>
      <section className="card section">
        <p className="section-label">Recent Interview Activity</p>
        {recentActivity.length === 0 ? <EmptyState title="No recent interview activity" /> : recentActivity.map((item) => (
          <div className="flex items-center justify-between divider" key={item.screeningId}>
            <div><div className="font-semibold">{item.candidateName || 'Unnamed candidate'}</div><div className="text-sm text-secondary">{item.candidateRole || 'Role unavailable'}</div></div>
            <ScoreBadge scoreDisplay={{ value: item.overallScore ?? null, color: item.recommendationBadge?.color || 'gray' }} size="compact" />
            <span className={`badge badge-${item.recommendationBadge?.color || 'gray'}`}>{item.recommendationBadge?.label || 'Pending'}</span>
            <span className="text-sm text-muted">{formatTimeAgo(item.completedAt)}</span>
          </div>
        ))}
      </section>
    </div>
  )
}
