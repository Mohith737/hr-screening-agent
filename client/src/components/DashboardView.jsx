import EmptyState from './EmptyState'
import LoadingSpinner from './LoadingSpinner'
import ScoreBadge from './ScoreBadge'

function formatTime(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function scoreDisplay(candidate) {
  return { value: candidate.overallScore ?? null, color: candidate.recommendationBadge?.color || 'gray' }
}

export default function DashboardView({ data, onSelectCandidate }) {
  if (data === null) {
    return <div className="center-panel"><LoadingSpinner /></div>
  }

  const pipeline = data.pipeline || {}
  const topCandidates = data.topCandidates || []
  const recentActivity = data.recentActivity || []

  return (
    <div>
      <h1 className="dashboard-title">Recruiter Decision Cockpit</h1>
      <section className="card">
        <div className="section-title">Pipeline Overview</div>
        <div className="stats-grid">
          <div className="stat-block"><div className="stat-number">{pipeline.total ?? 0}</div><div className="stat-label">Total</div></div>
          <div className="stat-block"><div className="stat-number">{pipeline.pending ?? 0}</div><div className="stat-label">Pending</div></div>
          <div className="stat-block"><div className={`stat-number ${pipeline.screening > 0 ? 'color-blue' : ''}`}>{pipeline.screening ?? 0}</div><div className="stat-label">In Progress</div></div>
          <div className="stat-block"><div className={`stat-number ${pipeline.completed > 0 ? 'color-green' : ''}`}>{pipeline.completed ?? 0}</div><div className="stat-label">Completed</div></div>
        </div>
      </section>
      <section className="card">
        <div className="section-title">Top Candidates By Score</div>
        {topCandidates.length === 0 ? (
          <EmptyState title="No scored candidates yet" subtitle="Complete a screening to see rankings." />
        ) : (
          <div className="top-cards">
            {topCandidates.slice(0, 3).map((candidate) => (
              <button className="top-card" key={candidate.id} onClick={() => onSelectCandidate(candidate.id)} type="button">
                <div className="flex justify-between gap-12">
                  <div>
                    <div className="font-semibold truncate">{candidate.name || 'Unnamed candidate'}</div>
                    <div className="text-xs text-secondary truncate">{candidate.role || 'Role unavailable'}</div>
                  </div>
                  <ScoreBadge scoreDisplay={scoreDisplay(candidate)} />
                </div>
                <div className="flex gap-8 mt-12">
                  <span className={`badge bg-${candidate.recommendationBadge?.color || 'gray'}`}>{candidate.recommendationBadge?.label || 'Pending'}</span>
                  <span className={`badge bg-${candidate.languageBadge?.color || 'gray'}`}>{candidate.languageBadge?.label || 'Language'}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
      <section className="card">
        <div className="section-title">Recent Screenings</div>
        {recentActivity.length === 0 ? (
          <EmptyState title="No completed screenings" />
        ) : recentActivity.map((item) => (
          <div className="activity-row" key={item.screeningId}>
            <div><div className="font-medium">{item.candidateName || 'Unnamed candidate'}</div><div className="text-xs text-secondary">{item.candidateRole || 'Role unavailable'}</div></div>
            <div className="font-semibold">{item.overallScore ?? '--'}</div>
            <span className={`badge bg-${item.recommendationBadge?.color || 'gray'}`}>{item.recommendationBadge?.label || 'Pending'}</span>
            <div className="text-xs text-muted">{formatTime(item.completedAt)}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
