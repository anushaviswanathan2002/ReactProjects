import React from 'react';
import NoteCard from './NoteCard';
import './NoteList.css';

function NoteList({ notes, selectedNoteId, onSelectNote, onDeleteNote }) {
  return (
    <div className="note-list">
      <div className="note-list__header">
        <span className="note-list__count">
          {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
        </span>
      </div>

      <div className="note-list__items">
        {notes.length === 0 ? (
          <div className="note-list__empty">
            <span className="note-list__empty-icon">🗒️</span>
            <p>No notes found</p>
            <p className="note-list__empty-sub">Click <strong>+</strong> to create one</p>
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isSelected={note.id === selectedNoteId}
              onSelect={() => onSelectNote(note.id)}
              onDelete={() => onDeleteNote(note.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default NoteList;
