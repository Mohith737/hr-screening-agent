export default function SortControl({ value, onChange }) {
  return (
    <div className="sort-control">
      <span className="sidebar-candidate-meta">Sort:</span>
      <select className="sort-select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="score">By Score</option>
        <option value="recommendation">By Recommendation</option>
        <option value="status">By Status</option>
      </select>
    </div>
  )
}
