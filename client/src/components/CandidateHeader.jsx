import StatusBadge from './StatusBadge'

export default function CandidateHeader({ candidate }) {
  return (
    <section className="card candidate-header">
      <div className="candidate-header-main">
        <div>
          <h1>{candidate.name || 'Unnamed candidate'}</h1>
          <div className="text-secondary">{candidate.role || 'Role unavailable'}</div>
          <div className="text-xs text-muted mt-8">
            {candidate.email || 'Email unavailable'} · Applied {candidate.appliedDate || 'date unavailable'}
          </div>
        </div>
        {candidate.hasIntelligenceReport && <div className="badge bg-green">✓ Analysed</div>}
      </div>
      <div className="flex items-center gap-8 mt-12">
        <StatusBadge displayStatus={candidate.displayStatus} />
        <span className={`badge bg-${candidate.languageBadge?.color || 'gray'}`}>
          {candidate.languageBadge?.label || 'Language'}
        </span>
        <span className={`badge bg-${candidate.canTriggerScreening ? 'blue' : 'gray'}`}>
          {candidate.canTriggerScreening ? 'Ready to screen' : 'No action'}
        </span>
      </div>
    </section>
  )
}
