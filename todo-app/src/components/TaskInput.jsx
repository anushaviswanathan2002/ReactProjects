import { useState } from 'react';
import './TaskInput.css';

function TaskInput({ onAdd }) {
  const [text, setText] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 500);
      return;
    }
    
    onAdd(text);
    setText('');
  };

  return (
    <form className="task-input" onSubmit={handleSubmit}>
      <input
        type="text"
        className={`input ${hasError ? 'shake' : ''}`}
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <button 
        type="submit" 
        className="add-button"
        disabled={!text.trim()}
      >
        <svg 
          className="add-icon" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add
      </button>
    </form>
  );
}

export default TaskInput;