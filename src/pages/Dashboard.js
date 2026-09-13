import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MemoryGame from '../components/MemoryGame';
import MemoryNotes from '../components/MemoryNotes';
import '../styles/Dashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Dashboard({ username, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('game'); // 'game' or 'notes'
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/memories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemories(response.data);
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMemory = async (title, description) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/memories`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMemories([response.data, ...memories]);
    } catch (err) {
      console.error('Failed to add memory:', err);
    }
  };

  const deleteMemory = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/memories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemories(memories.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📝 Memory App</h1>
          <div className="user-info">
            <span>Welcome, <strong>{username}</strong>!</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'game' ? 'active' : ''}`}
          onClick={() => setActiveTab('game')}
        >
          🎮 Memory Game
        </button>
        <button
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          📚 My Memories
        </button>
      </div>

      <main className="dashboard-content">
        {activeTab === 'game' && <MemoryGame />}
        {activeTab === 'notes' && (
          <MemoryNotes
            memories={memories}
            onAdd={addMemory}
            onDelete={deleteMemory}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}
