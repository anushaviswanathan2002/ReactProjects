import React, { useState, useEffect } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {
    setNotes([{ ...note, id: Date.now(), createdAt: new Date().toISOString() }, ...notes]);
  };

  const updateNote = (updated) => {
    setNotes(notes.map((n) => (n.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : n)));
    setEditingNote(null);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <span className="logo">📝</span>
          <h1>Notes</h1>
          <span className="note-count">{notes.length} note{notes.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <NoteForm
            onSave={editingNote ? updateNote : addNote}
            editingNote={editingNote}
            onCancelEdit={() => setEditingNote(null)}
          />
        </aside>

        <section className="notes-section">
          <SearchBar value={search} onChange={setSearch} />
          <NoteList
            notes={filteredNotes}
            onEdit={setEditingNote}
            onDelete={deleteNote}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
