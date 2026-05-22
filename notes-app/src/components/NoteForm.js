import React, { useState, useEffect } from "react";

const COLORS = ["#fff9c4", "#c8e6c9", "#bbdefb", "#f8bbd0", "#e1bee7", "#ffe0b2"];

function NoteForm({ onSave, editingNote, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setColor(editingNote.color || COLORS[0]);
    } else {
      setTitle("");
      setContent("");
      setColor(COLORS[0]);
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    const note = editingNote
      ? { ...editingNote, title, content, color }
      : { title, content, color };
    onSave(note);
    setTitle("");
    setContent("");
    setColor(COLORS[0]);
  };

  return (
    <form className="note-form" onSubmit={handleSubmit} style={{ borderTop: `4px solid ${color}` }}>
      <h2 className="form-title">{editingNote ? "Edit Note" : "New Note"}</h2>

      <input
        className="form-input"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="form-textarea"
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
      />

      <div className="color-picker">
        <span className="color-label">Color</span>
        <div className="color-swatches">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`color-swatch ${color === c ? "selected" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingNote ? "Update Note" : "Add Note"}
        </button>
        {editingNote && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;
