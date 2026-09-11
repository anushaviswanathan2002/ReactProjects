import React from 'react';
import '../styles/NotesList.css';

function NotesList({
  notes,
  onDelete,
  onEdit,
  editingId,
  editingText,
  onEditChange,
  onSaveEdit,
  onCancelEdit
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No notes yet. Create your first note above!</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note.id} className="note-card">
          {editingId === note.id ? (
            <div className="note-edit">
              <textarea
                value={editingText}
                onChange={(e) => onEditChange(e.target.value)}
                className="note-edit-input"
              />
              <div className="note-edit-buttons">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onSaveEdit(note.id)}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={onCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="note-content">
                <p>{note.text}</p>
              </div>
              <div className="note-meta">
                <small>{formatDate(note.createdAt)}</small>
                <div className="note-actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => onEdit(note.id, note.text)}
                    title="Edit note"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => onDelete(note.id)}
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default NotesList;
