import React from 'react';

function MemoryList({ memories, onEdit, onDelete, onToggleFavorite }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="memory-list">
      {memories.map((memory) => (
        <div key={memory.id} className="memory-card">
          <div className="memory-card-header">
            <div className="memory-title-section">
              <h3>{memory.title}</h3>
              <p className="memory-date">{formatDate(memory.createdAt)}</p>
            </div>
            <button
              onClick={() => onToggleFavorite(memory.id)}
              className={`favorite-btn ${memory.isFavorite ? 'favorited' : ''}`}
              title={memory.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              ★
            </button>
          </div>

          <div className="memory-card-body">
            <p className="memory-description">{memory.description}</p>
          </div>

          <div className="memory-card-footer">
            <button
              onClick={() => onEdit(memory)}
              className="btn btn-small btn-primary"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(memory.id)}
              className="btn btn-small btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MemoryList;
