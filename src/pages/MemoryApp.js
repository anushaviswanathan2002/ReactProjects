import React, { useState, useEffect } from 'react';
import MemoryCard from '../components/MemoryCard';
import NotesList from '../components/NotesList';
import '../styles/MemoryApp.css';

function MemoryApp({ user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Load notes from localStorage
  useEffect(() => {
    const storedNotes = localStorage.getItem(`notes_${user.id}`);
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, [user.id]);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem(`notes_${user.id}`, JSON.stringify(notes));
  }, [notes, user.id]);

  const addNote = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      const note = {
        id: Date.now().toString(),
        text: newNote.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    if (editingText.trim()) {
      setNotes(notes.map(note =>
        note.id === id
          ? { ...note, text: editingText.trim(), updatedAt: new Date().toISOString() }
          : note
      ));
      setEditingId(null);
      setEditingText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  return (
    <div className="memory-app">
      <header className="app-header">
        <div className="header-content">
          <h1>📝 Memory App</h1>
          <div className="user-info">
            <span>Welcome, <strong>{user.name}</strong></span>
            <button className="btn btn-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="app-tabs">
        <button
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          📋 Notes
        </button>
        <button
          className={`tab-btn ${activeTab === 'memory' ? 'active' : ''}`}
          onClick={() => setActiveTab('memory')}
        >
          🎮 Memory Game
        </button>
      </div>

      <main className="app-content">
        {activeTab === 'notes' && (
          <div className="notes-section">
            <form onSubmit={addNote} className="note-form">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write your memory, note, or thought..."
                className="note-input"
                rows="4"
              />
              <button type="submit" className="btn btn-primary btn-add-note">
                ✏️ Add Note
              </button>
            </form>

            <NotesList
              notes={notes}
              onDelete={deleteNote}
              onEdit={startEditing}
              editingId={editingId}
              editingText={editingText}
              onEditChange={(text) => setEditingText(text)}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
            />
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="memory-game-section">
            <h2>Match the Pairs!</h2>
            <MemoryCard />
          </div>
        )}
      </main>
    </div>
  );
}

export default MemoryApp;
