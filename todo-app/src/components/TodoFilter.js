import React from 'react';
import './TodoFilter.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

function TodoFilter({ filter, onFilterChange, activeCount, completedCount, totalCount }) {
  return (
    <div className="todo-filter">
      <div className="filter-stats">
        <span>{totalCount} total</span>
        <span>{activeCount} active</span>
        <span>{completedCount} done</span>
      </div>
      <div className="filter-buttons">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => onFilterChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TodoFilter;
