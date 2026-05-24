import React, { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  const addTodo = (text) => {
    if (!text.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: text.trim(), completed: false },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">My To-Do List</h1>

        <TodoInput onAdd={addTodo} />

        {todos.length > 0 && (
          <>
            <div className="filters">
              {['all', 'active', 'completed'].map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />

            <div className="footer">
              <span>{remaining} item{remaining !== 1 ? 's' : ''} left</span>
              {todos.some((t) => t.completed) && (
                <button className="clear-btn" onClick={clearCompleted}>
                  Clear completed
                </button>
              )}
            </div>
          </>
        )}

        {todos.length === 0 && (
          <p className="empty">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default App;
