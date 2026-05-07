import { useMemo } from 'react'
import RolePipelineGroup from './RolePipelineGroup'

export default function Sidebar({
  candidates,
  selectedId,
  comparisonIds,
  onSelect,
  onDashboard,
  onToggleCompare,
  onOpenComparison,
  view,
}) {
  const grouped = useMemo(() => {
    const groups = {}
    candidates.forEach((candidate) => {
      if (!groups[candidate.role]) groups[candidate.role] = []
      groups[candidate.role].push(candidate)
    })
    return groups
  }, [candidates])

  const comparisonCandidates = comparisonIds
    .map((id) => candidates.find((candidate) => candidate.id === id))
    .filter(Boolean)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-wordmark">HireIQ</div>
        <div className="sidebar-subtitle">Recruiter Intelligence</div>
      </div>
      <nav className="sidebar-nav">
        <button className={`sidebar-nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={onDashboard} type="button">
          <span>Dashboard</span>
        </button>
      </nav>
      <div className="sidebar-scroll">
        {Object.entries(grouped).map(([role, roleCandidates]) => (
          <RolePipelineGroup
            key={role}
            role={role}
            candidates={roleCandidates}
            selectedId={selectedId}
            comparisonIds={comparisonIds}
            onSelect={onSelect}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>
      {comparisonCandidates.length >= 2 && (
        <div className="comparison-bar">
          <div className="flex items-center justify-between gap-8">
            <div>
              <div className="font-semibold">Compare {comparisonCandidates.length} candidates</div>
              <div className="text-xs" style={{ opacity: 0.78 }}>Same role recommended</div>
            </div>
            <button className="btn btn-sm" onClick={onOpenComparison} type="button">
              View Comparison
            </button>
          </div>
          <div className="flex gap-4 mt-8">
            {comparisonCandidates.map((candidate) => (
              <button
                className="btn btn-sm"
                key={candidate.id}
                onClick={() => onToggleCompare(candidate.id, candidate.role)}
                type="button"
              >
                Remove {candidate.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
