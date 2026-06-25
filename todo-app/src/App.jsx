import { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import './App.css';

const STORAGE_KEY = 'notebook-tasks';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Graceful fallback for browsers without localStorage
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (text) => {
    const newTask = {
      id: generateId(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="app">
      <div className="notebook-container">
        <div className="spiral-binding">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="spiral-ring">
              <div className="spiral-hole" />
            </div>
          ))}
        </div>
        
        <div className="task-card">
          <header className="header">
            <h1 className="title">My Tasks</h1>
            {totalCount > 0 && (
              <p className="task-count">
                {completedCount} of {totalCount} done
              </p>
            )}
          </header>

          <TaskInput onAdd={addTask} />

          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />

          {allCompleted && (
            <div className="celebration">
              <span className="celebration-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </span>
              All done! Amazing work!
            </div>
          )}

          <footer className="footer">
            Small steps lead to big results
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;