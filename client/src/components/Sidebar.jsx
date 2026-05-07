import CandidateCard from './CandidateCard'

export default function Sidebar({ candidates, selectedId, onSelect, onDashboard, view }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">HireIQ</div>
        <div className="text-xs text-muted">Recruiter Intelligence</div>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`btn nav-button ${view === 'dashboard' ? 'active' : ''}`}
          onClick={onDashboard}
          type="button"
        >
          <span>Dashboard</span>
          <span>{candidates.length}</span>
        </button>
      </nav>
      <section className="candidate-list-wrap">
        <div className="section-title">CANDIDATES ({candidates.length})</div>
        <div className="candidate-list">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={candidate.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </section>
    </aside>
  )
}
