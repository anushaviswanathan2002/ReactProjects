import React from 'react';
import Timer from './Timer';

function TodoItem({ todo, onToggle, onDelete, onEdit, onTimeUpdate }) {
  const getPriorityEmoji = (priority) => {
    const emojis = { high: '🔴', medium: '🟡', low: '🟢' };
    return emojis[priority] || '⚪';
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.priority}-priority`}>
      <div className="todo-item-left">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <div className="todo-item-content">
          <div className="todo-item-title">{todo.title}</div>
          {todo.description && (
            <p style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '4px' }}>
              {todo.description}
            </p>
          )}
          <div className="todo-item-meta">
            <span className="todo-badge priority-badge" style={{ color: `var(--priority-${todo.priority})` }}>
              {getPriorityEmoji(todo.priority)} {todo.priority}
            </span>
            <span className="todo-badge category-badge">
              📂 {todo.category}
            </span>
            <span className="todo-badge" style={{ fontSize: '11px' }}>
              {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="timer-wrapper">
            <Timer 
              todoId={todo.id}
              timeSpent={todo.timeSpent || 0}
              onTimeUpdate={(time) => onTimeUpdate(todo.id, time)}
            />
          </div>
        </div>
      </div>
      <div className="todo-item-actions">
        <button
          className="action-button edit-button"
          onClick={() => onEdit(todo)}
          title="Edit"
        >
          ✏️ Edit
        </button>
        <button
          className="action-button delete-button"
          onClick={() => onDelete(todo.id)}
          title="Delete"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
