import React, { useState } from "react";

function NoteCard({ note, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="note-card" style={{ backgroundColor: note.color || "#fff9c4" }}>
      {note.title && <h3 className="note-title">{note.title}</h3>}
      <p className="note-content">{note.content}</p>
      <div className="note-meta">
        <span className="note-date">
          {note.updatedAt
            ? `Updated ${formatDate(note.updatedAt)}`
            : formatDate(note.createdAt)}
        </span>
      </div>
      <div className="note-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => onEdit(note)}
          title="Edit note"
        >
          ✏️
        </button>
        {confirmDelete ? (
          <div className="confirm-delete">
            <span>Delete?</span>
            <button className="action-btn confirm-btn" onClick={() => onDelete(note.id)}>Yes</button>
            <button className="action-btn cancel-btn" onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        ) : (
          <button
            className="action-btn delete-btn"
            onClick={() => setConfirmDelete(true)}
            title="Delete note"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

export default NoteCard;
