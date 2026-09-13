import React from 'react';

function MemoryList({ memories, onEdit, onDelete }) {
  if (memories.length === 0) {
    return (
      <div className="empty-state">
        <p>No memories yet. Create your first memory to get started!</p>
      </div>
    );
  }

  return (
    <div className="memories-grid">
      {memories.map((memory) => (
        <div key={memory.id} className="memory-card">
          <div className="memory-header">
            <h4>{memory.title}</h4>
            <div className="memory-actions">
              <button
                onClick={() => onEdit(memory.id)}
                className="btn-icon edit"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(memory.id)}
                className="btn-icon delete"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
          <p className="memory-content">{memory.content}</p>
          <div className="memory-footer">
            <small className="memory-date">
              Created: {memory.createdAt}
            </small>
            {memory.updatedAt && (
              <small className="memory-date">
                Updated: {memory.updatedAt}
              </small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MemoryList;
