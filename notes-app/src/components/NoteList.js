import React from "react";
import NoteCard from "./NoteCard";

function NoteList({ notes, onEdit, onDelete }) {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🗒️</span>
        <p>No notes yet. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className="note-grid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default NoteList;
