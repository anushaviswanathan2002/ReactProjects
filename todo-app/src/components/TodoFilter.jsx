const FILTERS = ['all', 'active', 'completed']

function TodoFilter({ filter, onFilterChange, activeCount, totalCount }) {
  return (
    <div className="filter-bar">
      <span className="task-count">
        {activeCount} of {totalCount} task{totalCount !== 1 ? 's' : ''} remaining
      </span>
      <div className="filter-buttons">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => onFilterChange(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TodoFilter
