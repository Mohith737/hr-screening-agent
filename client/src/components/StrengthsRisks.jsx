export default function StrengthsRisks({ strengths = [], risks = [] }) {
  return (
    <div>
      <div className="section-title">Strengths</div>
      {strengths.length === 0 ? (
        <div className="text-muted text-sm">None identified</div>
      ) : strengths.map((item) => (
        <div className="list-line" key={item}>
          <span className="color-green">✓</span>
          <span>{item}</span>
        </div>
      ))}
      <div className="divider" />
      <div className="section-title">Risks</div>
      {risks.length === 0 ? (
        <div className="text-muted text-sm">None identified</div>
      ) : risks.map((item) => (
        <div className="list-line" key={item}>
          <span className="color-yellow">⚠</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}
