export default function ScoreBadge({ scoreDisplay, size = '' }) {
  const value = scoreDisplay?.value ?? null
  const color = scoreDisplay?.color || 'gray'
  const title =
    value === null ? undefined : value >= 75 ? 'Strong Fit Score' : value >= 50 ? 'Average Score' : 'Weak Score'

  return (
    <span className={`score-badge bg-${value === null ? 'gray' : color} ${size}`} title={title}>
      {value === null ? '--' : value}
    </span>
  )
}
