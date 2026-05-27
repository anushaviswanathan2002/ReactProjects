import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-illustration">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="12" width="48" height="40" rx="4" stroke="#d4cfc7" strokeWidth="2" fill="none" />
            <line x1="16" y1="24" x2="48" y2="24" stroke="#d4cfc7" strokeWidth="2" />
            <line x1="16" y1="32" x2="40" y2="32" stroke="#d4cfc7" strokeWidth="2" />
            <line x1="16" y1="40" x2="36" y2="40" stroke="#d4cfc7" strokeWidth="2" />
            <circle cx="48" cy="44" r="12" fill="#f5f0e8" stroke="#d4cfc7" strokeWidth="2" />
            <path d="M43 44L46 47L53 40" stroke="#d4cfc7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="empty-message">No tasks yet — add your first one above</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;