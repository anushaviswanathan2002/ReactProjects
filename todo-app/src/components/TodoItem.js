import React, { useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editValue.trim()) { onEdit(todo.id, editValue); setIsEditing(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setEditValue(todo.text); setIsEditing(false); }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <button
        className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark active' : 'Mark complete'}
      >
        {todo.completed && <span className="checkmark">✓</span>}
      </button>

      {isEditing ? (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <input
            className="edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button className="save-btn" type="submit">Save</button>
          <button className="cancel-btn" type="button" onClick={() => { setEditValue(todo.text); setIsEditing(false); }}>Cancel</button>
        </form>
      ) : (
        <>
          <span className="todo-text">{todo.text}</span>
          <div className="todo-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)} title="Edit">✏️</button>
            <button className="delete-btn" onClick={() => onDelete(todo.id)} title="Delete">🗑️</button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;
