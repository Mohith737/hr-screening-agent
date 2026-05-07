export default function StrengthsRisks({ strengths = [], risks = [] }) {
  return (
    <div>
      <div className="section-title">Strengths</div>
      {strengths.length === 0 ? (
        <div className="text-muted text-sm">None identified</div>
      ) : strengths.map((item) => (
        <div className="strength-item" key={item}>
          <span className="strength-icon">+</span>
          <span>{item}</span>
        </div>
      ))}
      <div className="divider" />
      <div className="section-title">Risks</div>
      {risks.length === 0 ? (
        <div className="text-muted text-sm">None identified</div>
      ) : risks.map((item) => (
        <div className="risk-item" key={item}>
          <span className="risk-icon">!</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}
