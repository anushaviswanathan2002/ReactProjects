import React, { useState, useEffect } from 'react';
import '../styles/MemoryNotes.css';

function MemoryNotes({ user, onLogout }) {
  const [memories, setMemories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/memories', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch memories');
      }

      const data = await response.json();
      setMemories(data.memories);
    } catch (err) {
      setError('Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        throw new Error('Failed to add memory');
      }

      const data = await response.json();
      setMemories([...memories, data.memory]);
      setTitle('');
      setContent('');
      setSuccess('Memory added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add memory');
    }
  };

  const handleDeleteMemory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    try {
      const response = await fetch(`/api/memories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete memory');
      }

      setMemories(memories.filter(m => m.id !== id));
      setSuccess('Memory deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete memory');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="memory-container">
      <header className="memory-header">
        <div className="header-content">
          <h1>My Memories</h1>
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="memory-content">
        <div className="add-memory-section">
          <h2>Add a New Memory</h2>
          <form onSubmit={handleAddMemory} className="memory-form">
            <input
              type="text"
              placeholder="Memory Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Write your memory here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              required
            />
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit">Save Memory</button>
          </form>
        </div>

        <div className="memories-list-section">
          <h2>Your Memories</h2>
          {loading ? (
            <p>Loading memories...</p>
          ) : memories.length === 0 ? (
            <p className="no-memories">No memories yet. Create one above!</p>
          ) : (
            <div className="memories-grid">
              {memories.map((memory) => (
                <div key={memory.id} className="memory-card">
                  <h3>{memory.title}</h3>
                  <p>{memory.content}</p>
                  <small>
                    {new Date(memory.createdAt).toLocaleDateString()}
                  </small>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMemory(memory.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoryNotes;
