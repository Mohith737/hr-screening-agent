export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="empty-state-container">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <div className="empty-state-title">{title}</div>
      {subtitle && <div className="empty-state-subtitle">{subtitle}</div>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  )
}
