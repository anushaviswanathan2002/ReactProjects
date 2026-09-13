import React, { useState } from 'react';
import '../styles/MemoryNotes.css';

export default function MemoryNotes({ memories, onAdd, onDelete, loading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAdd(title, description);
    setTitle('');
    setDescription('');
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      onDelete(id);
    }
  };

  return (
    <div className="memory-notes">
      <div className="add-memory">
        {!isAdding ? (
          <button className="add-btn" onClick={() => setIsAdding(true)}>
            ➕ Add New Memory
          </button>
        ) : (
          <form onSubmit={handleAddMemory} className="memory-form">
            <input
              type="text"
              placeholder="Memory title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
            <textarea
              placeholder="Add details about your memory..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
            <div className="form-buttons">
              <button type="submit" className="save-btn">
                Save Memory
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsAdding(false);
                  setTitle('');
                  setDescription('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {loading ? (
        <p className="loading">Loading your memories...</p>
      ) : memories.length === 0 ? (
        <p className="empty-state">No memories yet. Create your first one! 📝</p>
      ) : (
        <div className="memories-list">
          {memories.map((memory) => (
            <div key={memory.id} className="memory-card">
              <h3>{memory.title}</h3>
              {memory.description && <p>{memory.description}</p>}
              <div className="memory-meta">
                <small>{new Date(memory.createdAt).toLocaleDateString()}</small>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(memory.id)}
                  title="Delete memory"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
