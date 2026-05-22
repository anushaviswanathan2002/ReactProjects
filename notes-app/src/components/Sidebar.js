import React from 'react';
import './Sidebar.css';

function Sidebar({ searchQuery, onSearchChange, onNewNote }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">📝</span>
          <h1 className="sidebar__title">Notes</h1>
        </div>
        <button className="sidebar__new-btn" onClick={onNewNote} title="New Note">
          +
        </button>
      </div>

      <div className="sidebar__search">
        <span className="sidebar__search-icon">🔍</span>
        <input
          type="text"
          className="sidebar__search-input"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="sidebar__search-clear"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
