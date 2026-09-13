import React from 'react';

function StatsSection({ stats }) {
  return (
    <div className="stats-section">
      <h2>📊 Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' }}>
          <div className="stat-number">{stats.highPriority}</div>
          <div className="stat-label">High Priority</div>
        </div>
      </div>
    </div>
  );
}

export default StatsSection;
