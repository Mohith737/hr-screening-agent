const colorVars = {
  green: 'var(--green)',
  yellow: 'var(--yellow)',
  red: 'var(--red)',
  blue: 'var(--blue)',
  purple: 'var(--purple)',
  orange: 'var(--orange)',
  gray: 'var(--gray)',
}

export default function StatusBadge({ displayStatus }) {
  const color = displayStatus?.color || 'gray'
  const label = displayStatus?.label || 'Unknown'

  return (
    <span className={`badge color-${color}`}>
      <span className="status-dot" style={{ background: colorVars[color] || colorVars.gray }} />
      {label}
    </span>
  )
}
