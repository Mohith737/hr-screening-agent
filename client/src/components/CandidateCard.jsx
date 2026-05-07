import ScoreBadge from './ScoreBadge'
import StatusBadge from './StatusBadge'

export default function CandidateCard({ candidate, isSelected, onSelect }) {
  return (
    <button
      className={`candidate-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(candidate.id)}
      type="button"
    >
      <div className="flex-col gap-8">
        <div>
          <div className="font-semibold truncate">{candidate.name || 'Unnamed candidate'}</div>
          <div className="text-xs text-secondary truncate">{candidate.role || 'Role unavailable'}</div>
        </div>
        <div className="flex items-center justify-between gap-8">
          <StatusBadge displayStatus={candidate.displayStatus} />
          <ScoreBadge scoreDisplay={candidate.scoreDisplay} size="compact" />
        </div>
        <div className="flex items-center gap-8">
          <span className={`badge bg-${candidate.recommendationBadge?.color || 'gray'}`}>
            {candidate.recommendationBadge?.label || 'Pending'}
          </span>
          <span className={`badge bg-${candidate.languageBadge?.color || 'gray'}`}>
            {candidate.languageBadge?.label || 'Language'}
          </span>
        </div>
      </div>
    </button>
  )
}
