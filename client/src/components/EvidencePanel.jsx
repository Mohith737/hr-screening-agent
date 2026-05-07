import EmptyState from './EmptyState'

export default function EvidencePanel({ evidence = [] }) {
  return (
    <div>
      <div className="section-title">Evidence</div>
      {evidence.length === 0 ? (
        <EmptyState
          icon=""
          title="No verified evidence captured"
          subtitle="Evidence quotes are extracted directly from interview transcripts."
        />
      ) : evidence.map((item, index) => {
        const impact = item.scoreImpact ?? item.impact ?? 0
        return (
          <div className="evidence-item" key={`${item.label || 'evidence'}-${index}`}>
            <div className="evidence-label-row">
              <div className="evidence-label">{item.label || 'Evidence'}</div>
              {impact > 0 && <span className="evidence-impact-badge evidence-impact-positive">+{impact} pts</span>}
              {impact < 0 && <span className="evidence-impact-badge evidence-impact-negative">{impact} pts</span>}
            </div>
            <blockquote className="evidence-quote">{item.quote || 'No quote captured'}</blockquote>
          </div>
        )
      })}
    </div>
  )
}
