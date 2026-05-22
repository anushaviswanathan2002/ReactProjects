import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import Sidebar from './components/Sidebar';
import './App.css';

const STORAGE_KEY = 'notes-app-data';

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewNote = () => {
    const newNote = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  const handleUpdateNote = (id, changes) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...changes, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const handleDeleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  return (
    <div className="app">
      <Sidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewNote={handleNewNote}
      />
      <NoteList
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onDeleteNote={handleDeleteNote}
      />
      <NoteEditor
        note={selectedNote}
        onUpdateNote={handleUpdateNote}
      />
    </div>
  );
}

export default App;
