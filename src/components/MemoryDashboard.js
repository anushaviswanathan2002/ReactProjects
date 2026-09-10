import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import MemoryForm from './MemoryForm';
import MemoryList from './MemoryList';

function MemoryDashboard() {
  const { user, logout } = useAuth();
  const [memories, setMemories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingMemory, setEditingMemory] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'favorites'

  // Load memories from localStorage
  useEffect(() => {
    const storedMemories = JSON.parse(
      localStorage.getItem(`memories_${user.email}`) || '[]'
    );
    setMemories(storedMemories);
  }, [user.email]);

  const saveMemories = (updatedMemories) => {
    localStorage.setItem(
      `memories_${user.email}`,
      JSON.stringify(updatedMemories)
    );
    setMemories(updatedMemories);
  };

  const handleAddMemory = (title, description) => {
    const newMemory = {
      id: Date.now(),
      title,
      description,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };
    saveMemories([newMemory, ...memories]);
    setEditingId(null);
    setEditingMemory(null);
  };

  const handleUpdateMemory = (id, title, description) => {
    const updated = memories.map((memory) =>
      memory.id === id ? { ...memory, title, description } : memory
    );
    saveMemories(updated);
    setEditingId(null);
    setEditingMemory(null);
  };

  const handleDeleteMemory = (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      saveMemories(memories.filter((m) => m.id !== id));
    }
  };

  const handleToggleFavorite = (id) => {
    const updated = memories.map((memory) =>
      memory.id === id ? { ...memory, isFavorite: !memory.isFavorite } : memory
    );
    saveMemories(updated);
  };

  const handleEdit = (memory) => {
    setEditingId(memory.id);
    setEditingMemory(memory);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingMemory(null);
  };

  const getFilteredMemories = () => {
    let filtered = [...memories];

    if (filter === 'favorites') {
      filtered = filtered.filter((m) => m.isFavorite);
    } else if (filter === 'recent') {
      filtered = filtered.slice(0, 10);
    }

    return filtered;
  };

  const filteredMemories = getFilteredMemories();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>My Memories</h1>
          <p className="welcome-text">Welcome, {user.name}!</p>
        </div>
        <button onClick={logout} className="btn btn-secondary">
          Log Out
        </button>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-main">
          {editingId ? (
            <div className="form-section">
              <h2>Edit Memory</h2>
              <MemoryForm
                initialMemory={editingMemory}
                onSubmit={(title, description) =>
                  handleUpdateMemory(editingId, title, description)
                }
                onCancel={handleCancel}
              />
            </div>
          ) : (
            <div className="form-section">
              <h2>Add a New Memory</h2>
              <MemoryForm
                onSubmit={handleAddMemory}
                onCancel={handleCancel}
              />
            </div>
          )}

          <div className="memories-section">
            <div className="memories-header">
              <h2>Your Memories ({filteredMemories.length})</h2>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
                  onClick={() => setFilter('recent')}
                >
                  Recent
                </button>
                <button
                  className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
                  onClick={() => setFilter('favorites')}
                >
                  Favorites
                </button>
              </div>
            </div>

            {filteredMemories.length > 0 ? (
              <MemoryList
                memories={filteredMemories}
                onEdit={handleEdit}
                onDelete={handleDeleteMemory}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : (
              <div className="empty-state">
                <p>
                  {filter === 'favorites'
                    ? 'No favorite memories yet. Add one to get started!'
                    : 'No memories yet. Create your first memory above!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoryDashboard;
