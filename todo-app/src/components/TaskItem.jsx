import { useState } from 'react';
import './TaskItem.css';

function TaskItem({ task, onToggle, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 250);
  };

  return (
    <li className={`task-item ${isDeleting ? 'deleting' : ''} ${task.completed ? 'completed' : ''}`}>
      <button
        className={`checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        <svg 
          className="check-icon" 
          width="14" 
          height="14" 
          viewBox="0 0 14 14" 
          fill="none"
        >
          <path
            d="M2.5 7L5.5 10L11.5 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      <span className="task-text">{task.text}</span>
      
      <button
        className="delete-button"
        onClick={handleDelete}
        aria-label="Delete task"
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
        </svg>
      </button>
    </li>
  );
}

export default TaskItem;