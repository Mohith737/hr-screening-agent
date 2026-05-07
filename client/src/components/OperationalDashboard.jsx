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
  const avgScore = data.averageScore || 0
  const topRoleAvg = Math.max(...roleHealth.map((role) => Number.isFinite(role.avg) ? role.avg : 0))
  const showActionGrid = attention.length > 0 && advancing.length > 0

  return (
    <div className="dashboard-flow" style={{ maxWidth: '1100px' }}>
      <div className="metric-strip">
        <div className="metric-block"><div className="metric-number">{pipeline.total ?? 0}</div><div className="metric-label">Total Candidates</div></div>
        <div className={`metric-block ${pipeline.completed > 0 ? 'has-value-green' : ''}`}><div className={`metric-number ${pipeline.completed > 0 ? 'text-green' : ''}`}>{pipeline.completed ?? 0}</div><div className="metric-label">Interviewed</div></div>
        <div className={`metric-block ${pipeline.screening > 0 ? 'has-value-blue' : ''}`}><div className={`metric-number ${pipeline.screening > 0 ? 'text-blue' : ''}`}>{pipeline.screening ?? 0}</div><div className="metric-label">In Progress</div></div>
        <div className={`metric-block ${advancing.length > 0 ? 'has-value-green' : ''}`}><div className="metric-number text-green">{advancing.length}</div><div className="metric-label">Advancing</div></div>
        <div className={`metric-block ${avgScore >= 70 ? 'has-value-green' : avgScore >= 50 ? 'has-value-yellow' : avgScore > 0 ? 'has-value-red' : ''}`}><div className="metric-number">{data.averageScore || '-'}</div><div className="metric-label">Avg Score</div></div>
      </div>
      <div className="meta" style={{ textAlign: 'center', padding: '0 0 20px' }}>
        AI-powered recruiter intelligence - prioritize faster, decide with confidence.
      </div>
      <div className="dashboard-divider" />
      <div className={showActionGrid ? 'dashboard-action-grid' : ''}>
        <section className="attention-zone section dashboard-section">
          <div className="dashboard-zone-label dashboard-zone-label-red">
            <span>!</span>
            <span>REQUIRES RECRUITER ACTION</span>
            {attention.length > 0 && <span className="dashboard-zone-count dashboard-zone-count-red">{attention.length}</span>}
          </div>
          {attention.length === 0 ? (
            <EmptyState
              icon="✓"
              title="Pipeline on track"
              subtitle="No urgent actions needed right now."
              action="Interviews in progress will appear here."
            />
          ) : (
            <div className="grid-3">
              {attention.map((candidate) => (
                <button className="compact-action-card card-clickable" key={candidate.id} onClick={() => onSelectCandidate(candidate.id)} type="button">
                  <div className="font-semibold">{candidate.name || 'Unnamed candidate'}</div>
                  <div className="text-sm text-secondary">{candidate.role || 'Role unavailable'}</div>
                  <div className="text-red text-sm mt-8">{candidate.displayStatus?.code === 'failed' ? 'Interview connection failed - retry when ready' : 'Not yet interviewed'}</div>
                </button>
              ))}
            </div>
          )}
        </section>
        <section className="advance-zone section dashboard-section dashboard-section-related">
          <div className="dashboard-zone-label dashboard-zone-label-green">
            <span>READY TO ADVANCE</span>
            {advancing.length > 0 && <span className="dashboard-zone-count dashboard-zone-count-green">{advancing.length}</span>}
          </div>
          {advancing.length === 0 ? (
            <EmptyState
              icon=""
              title="No candidates ready to advance yet"
              subtitle="Complete more interviews to surface top candidates."
              action="Start an AI interview from any pending candidate."
            />
          ) : (
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
      </div>
      <div className="dashboard-divider" />
      <section className="card section dashboard-section">
        <p className="section-label">Role Pipeline Health</p>
        <div className="role-health-table">
          <div className="role-health-row role-health-header">
            <span>Role</span>
            <span>Progress</span>
            <span>Avg</span>
            <span>Pending</span>
          </div>
          {roleHealth.map((role) => (
            <div className="role-health-row" key={role.role}>
              <span className="role-health-label">{role.role}</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="role-health-progress">{role.interviewed}/{role.total} interviewed</span>
                <span className="role-health-progress-track">
                  <span
                    className="role-health-progress-fill"
                    style={{
                      width: role.total > 0 ? `${Math.round((role.interviewed / role.total) * 100)}%` : '0%',
                      background: role.interviewed === role.total ? 'var(--green)' : 'var(--blue)',
                    }}
                  />
                </span>
              </span>
              <span
                className="role-health-score"
                style={{ color: !Number.isFinite(role.avg) ? 'var(--text-muted)' : role.avg >= 75 ? 'var(--green)' : role.avg >= 50 ? 'var(--yellow)' : 'var(--red)' }}
              >
                {role.avg || '-'}
                {Number.isFinite(role.avg) && role.avg === topRoleAvg && topRoleAvg > 0 && (
                  <span className="role-health-top-label">TOP</span>
                )}
              </span>
              <span className="role-health-pending">{role.pending}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="dashboard-divider" />
      <section className="card section dashboard-section">
        <p className="section-label">Interview Outcomes</p>
        {recentActivity.length === 0 ? <EmptyState title="No recent interview activity" /> : (
          <div className="activity-table">
            {recentActivity.map((item) => (
              <div className="activity-row" key={item.screeningId}>
                <div>
                  <div className="activity-candidate-name">{item.candidateName || 'Unnamed candidate'}</div>
                  <div className="activity-candidate-role">{item.candidateRole || 'Role unavailable'}</div>
                  {item.recommendationBadge?.color === 'red' && (
                    <span className="activity-outcome-note text-red">Not advancing</span>
                  )}
                  {item.recommendationBadge?.color === 'green' && (
                    <span className="activity-outcome-note text-green">Advancing</span>
                  )}
                </div>
                <div className={`activity-score bg-${item.recommendationBadge?.color || 'gray'}`}>{item.overallScore ?? '--'}</div>
                <div className="activity-badge">
                  <span className={`badge badge-${item.recommendationBadge?.color || 'gray'}`}>{item.recommendationBadge?.label || 'Pending'}</span>
                </div>
                <span className="activity-time">{formatTimeAgo(item.completedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
