import React, { useState, useEffect } from 'react';
import './NoteEditor.css';

function NoteEditor({ note, onUpdateNote }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    if (note) onUpdateNote(note.id, { title: value });
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    if (note) onUpdateNote(note.id, { content: value });
  };

  if (!note) {
    return (
      <div className="note-editor note-editor--empty">
        <div className="note-editor__placeholder">
          <span className="note-editor__placeholder-icon">✏️</span>
          <h2>Select a note to edit</h2>
          <p>Choose a note from the list or create a new one.</p>
        </div>
      </div>
    );
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="note-editor">
      <div className="note-editor__toolbar">
        <div className="note-editor__meta">
          Last edited:{' '}
          {new Date(note.updatedAt).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div className="note-editor__stats">
          {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount}{' '}
          {charCount === 1 ? 'char' : 'chars'}
        </div>
      </div>

      <input
        className="note-editor__title"
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Note title…"
        maxLength={120}
      />

      <textarea
        className="note-editor__content"
        value={content}
        onChange={handleContentChange}
        placeholder="Start writing your note here…"
      />
    </div>
  );
}

export default NoteEditor;
