export default function ExtractedFacts({ extractedFacts = {}, language }) {
  const facts = [
    ['Experience', extractedFacts.yearsExperience ? `${extractedFacts.yearsExperience} years` : '-'],
    ['Location', extractedFacts.location || '-'],
    ['Language', language || '-'],
    ['Notice Period', extractedFacts.noticePeriodDays ? `${extractedFacts.noticePeriodDays} days` : '-'],
    ['Salary Exp', extractedFacts.salaryExpectation || '-'],
  ]

  return (
    <div>
      <div className="section-title">Extracted Facts</div>
      <div className="facts-grid">
        {facts.map(([key, value]) => (
          <div key={key}>
            <div className="fact-key">{key}</div>
            <div className="fact-value">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
