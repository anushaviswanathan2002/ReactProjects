import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="clear-btn" onClick={() => onChange("")} title="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
