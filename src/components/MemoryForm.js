import React, { useState } from 'react';

function MemoryForm({ initialMemory, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialMemory?.title || '');
  const [description, setDescription] = useState(initialMemory?.description || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    onSubmit(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="memory-form">
      <div className="form-group">
        <label htmlFor="title">Memory Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your memory a title"
          maxLength="100"
        />
        <span className="char-count">{title.length}/100</span>
      </div>

      <div className="form-group">
        <label htmlFor="description">Memory Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write down your memory in detail..."
          rows="6"
          maxLength="1000"
        />
        <span className="char-count">{description.length}/1000</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialMemory ? 'Update Memory' : 'Save Memory'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default MemoryForm;
