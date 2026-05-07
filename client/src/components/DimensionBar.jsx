export default function DimensionBar({ label, scoreObj }) {
  const value = scoreObj?.value ?? null
  const color = scoreObj?.color || 'gray'
  const tier = value >= 80
    ? { label: 'Strong', cls: 'dim-strong' }
    : value >= 65
      ? { label: 'Solid', cls: 'dim-solid' }
      : value >= 50
        ? { label: 'Average', cls: 'dim-average' }
        : value !== null
          ? { label: 'Attention', cls: 'dim-attention' }
          : null

  return (
    <div className="dimension-bar-row">
      <span className="dimension-bar-label">{label}</span>
      <div className="dimension-bar-track">
        <div
          className="dimension-bar-fill"
          style={{ width: value ? `${value}%` : '0%', background: `var(--${color})` }}
        />
      </div>
      <span className="dimension-bar-value" style={{ color: `var(--${color})` }}>
        {value ?? '-'}
      </span>
      {tier && <span className={`dimension-interpretation ${tier.cls}`}>{tier.label}</span>}
    </div>
  )
}
