import React, { useState } from 'react';
import MemoryList from './MemoryList';
import MemoryForm from './MemoryForm';

function Dashboard({ user, onLogout, onUpdateMemories }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleAddMemory = (title, content) => {
    const newMemory = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toLocaleString()
    };

    const updatedMemories = [...user.memories, newMemory];
    onUpdateMemories(updatedMemories);
    setShowForm(false);
  };

  const handleEditMemory = (id, title, content) => {
    const updatedMemories = user.memories.map(memory =>
      memory.id === id
        ? { ...memory, title, content, updatedAt: new Date().toLocaleString() }
        : memory
    );
    onUpdateMemories(updatedMemories);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDeleteMemory = (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      const updatedMemories = user.memories.filter(memory => memory.id !== id);
      onUpdateMemories(updatedMemories);
    }
  };

  const getEditingMemory = () => {
    return user.memories.find(m => m.id === editingId);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>My Memories</h1>
          <p className="user-info">Welcome, {user.name}!</p>
        </div>
        <button onClick={onLogout} className="btn btn-danger">
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="memories-section">
          {!showForm ? (
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
              }}
              className="btn btn-primary"
            >
              + Add New Memory
            </button>
          ) : (
            <MemoryForm
              memory={editingId ? getEditingMemory() : null}
              onSubmit={editingId ? handleEditMemory : handleAddMemory}
              onCancel={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              isEditing={!!editingId}
            />
          )}

          <MemoryList
            memories={user.memories}
            onEdit={(id) => {
              setEditingId(id);
              setShowForm(true);
            }}
            onDelete={handleDeleteMemory}
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
