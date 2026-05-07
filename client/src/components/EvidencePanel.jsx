import EmptyState from './EmptyState'

export default function EvidencePanel({ evidence = [] }) {
  return (
    <div>
      <div className="section-title">Evidence</div>
      {evidence.length === 0 ? (
        <EmptyState icon="" title="No verified evidence captured" />
      ) : evidence.map((item, index) => {
        const impact = item.scoreImpact ?? item.impact ?? 0
        return (
          <div className="evidence-item" key={`${item.label || 'evidence'}-${index}`}>
            <div className="font-semibold">{item.label || 'Evidence'}</div>
            <blockquote className="evidence-quote">{item.quote || 'No quote captured'}</blockquote>
            {impact > 0 && <span className="badge bg-green">+{impact} pts</span>}
            {impact < 0 && <span className="badge bg-red">{impact} pts</span>}
          </div>
        )
      })}
    </div>
  )
}
