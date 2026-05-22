import React, { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  const addTodo = (text) => {
    setTodos((prev) => [{ id: Date.now(), text: text.trim(), completed: false }, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText.trim() } : t))
    );
  };

  const clearCompleted = () => setTodos((prev) => prev.filter((t) => !t.completed));

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title"><span className="title-icon">✅</span> My To-Do List</h1>
          <p className="app-subtitle">Stay organised, get things done.</p>
        </header>

        <TodoInput onAdd={addTodo} />

        <TodoFilter
          filter={filter}
          onFilterChange={setFilter}
          activeCount={activeCount}
          completedCount={completedCount}
          totalCount={todos.length}
        />

        <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />

        {completedCount > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear completed ({completedCount})
          </button>
        )}

        {todos.length === 0 && <p className="empty-state">No tasks yet — add one above! 🚀</p>}
      </div>
    </div>
  );
}

export default App;
