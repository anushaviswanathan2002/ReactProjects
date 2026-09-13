import React, { useState, useEffect } from 'react';

function MemoryForm({ memory, onSubmit, onCancel, isEditing }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setContent(memory.content);
    }
  }, [memory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(memory?.id, title, content);
    setTitle('');
    setContent('');
  };

  return (
    <div className="memory-form-container">
      <form onSubmit={handleSubmit} className="memory-form">
        <h3>{isEditing ? 'Edit Memory' : 'Create New Memory'}</h3>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Memory title"
            maxLength="100"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your memory here..."
            rows="6"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Memory' : 'Save Memory'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemoryForm;
