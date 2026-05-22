import React from 'react';
import './NoteCard.css';

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function NoteCard({ note, isSelected, onSelect, onDelete }) {
  const preview = note.content.replace(/\n/g, ' ').slice(0, 80);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={`note-card ${isSelected ? 'note-card--selected' : ''}`}
      onClick={onSelect}
    >
      <div className="note-card__top">
        <h3 className="note-card__title">{note.title || 'Untitled Note'}</h3>
        <button
          className="note-card__delete"
          onClick={handleDelete}
          title="Delete note"
        >
          🗑️
        </button>
      </div>
      <p className="note-card__preview">{preview || 'No content yet…'}</p>
      <span className="note-card__date">{formatDate(note.updatedAt)}</span>
    </div>
  );
}

export default NoteCard;
