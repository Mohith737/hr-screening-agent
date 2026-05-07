import { useMemo, useState } from 'react'
import SortControl from './SortControl'

const recommendationRank = { green: 0, yellow: 1, red: 2, gray: 3 }
const statusRank = { completed: 0, screening: 1, failed: 2, pending: 3 }

export default function RolePipelineGroup({
  role,
  candidates,
  selectedId,
  comparisonIds,
  onSelect,
  onToggleCompare,
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [sortBy, setSortBy] = useState('score')

  const sorted = useMemo(() => {
    return [...candidates].sort((a, b) => {
      if (sortBy === 'recommendation') {
        return (recommendationRank[a.recommendationBadge?.color] ?? 4) - (recommendationRank[b.recommendationBadge?.color] ?? 4)
      }
      if (sortBy === 'status') {
        return (statusRank[a.displayStatus?.code] ?? 9) - (statusRank[b.displayStatus?.code] ?? 9)
      }
      return (b.scoreDisplay?.value ?? -1) - (a.scoreDisplay?.value ?? -1)
    })
  }, [candidates, sortBy])

  const completed = candidates.filter((candidate) => candidate.displayStatus?.code === 'completed').length
  const advancing = candidates.filter((candidate) => candidate.recommendationBadge?.label === 'Strong Fit').length
  const pending = candidates.filter((candidate) => candidate.displayStatus?.code === 'pending').length
  const statusLabel = (candidate) =>
    candidate.displayStatus?.code === 'failed' ? 'Interview connection unsuccessful' : candidate.displayStatus?.label || 'Unknown status'

  return (
    <section className="role-group">
      <div className="role-group-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{isOpen ? 'v' : '>'} {role}</span>
        <span className="role-group-count">{candidates.length}</span>
      </div>
      <div className="role-group-candidates" style={{ maxHeight: isOpen ? '1000px' : '0' }}>
        <SortControl value={sortBy} onChange={setSortBy} />
        <div className="sidebar-candidate-meta" style={{ padding: '4px 16px 8px' }}>
          {completed} interviewed - {advancing} advancing - {pending} pending
        </div>
        {sorted.map((candidate) => (
          <div
            className={`sidebar-candidate ${candidate.id === selectedId ? 'selected' : ''}`}
            key={candidate.id}
            onClick={() => onSelect(candidate.id)}
          >
            <input
              className="compare-checkbox"
              checked={comparisonIds.includes(candidate.id)}
              onChange={() => onToggleCompare(candidate.id, candidate.role)}
              onClick={(event) => event.stopPropagation()}
              type="checkbox"
            />
            <div className="sidebar-candidate-row">
              <span className="sidebar-candidate-name">{candidate.name || 'Unnamed candidate'}</span>
              {candidate.scoreDisplay?.value != null && (
                <div className={`sidebar-score-compact bg-${candidate.scoreDisplay?.color || 'gray'}`}>
                  {candidate.scoreDisplay?.value}
                </div>
              )}
            </div>
            <div className="sidebar-candidate-row">
              <span style={{ fontSize: '11px', color: 'var(--text-sidebar-muted)' }}>
                {statusLabel(candidate)}
              </span>
              <div className="sidebar-candidate-badges">
                <span className={`badge badge-${candidate.recommendationBadge?.color || 'gray'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                  {candidate.recommendationBadge?.label || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
