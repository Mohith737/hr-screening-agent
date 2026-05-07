export default function DimensionBar({ label, scoreObj }) {
  const value = scoreObj?.value ?? null
  const color = scoreObj?.color || 'gray'

  return (
    <div className="dimension-row">
      <div className="flex justify-between text-sm mb-16">
        <span className="text-secondary">{label}</span>
        <span className={`font-semibold color-${value === null ? 'gray' : color}`}>{value === null ? '--' : value}</span>
      </div>
      <div className="bar-track">
        <div
          className="bar-fill"
          style={{ width: value === null ? '0%' : `${value}%`, background: `var(--${color})` }}
        />
      </div>
    </div>
  )
}
