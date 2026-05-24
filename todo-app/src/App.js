import React, { useState } from "react";
import "./App.css";

const FILTERS = ["All", "Active", "Completed"];

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Buy groceries", completed: false },
    { id: 2, text: "Read a book", completed: false },
    { id: 3, text: "Go for a walk", completed: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTodo = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }]);
    setInputValue("");
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: trimmed } : t)));
    setEditingId(null);
    setEditText("");
  };

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">
          <span className="title-icon">✅</span> My To-Do List
        </h1>

        {/* Input */}
        <div className="input-row">
          <input
            className="todo-input"
            type="text"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button className="add-btn" onClick={addTodo}>
            Add
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-row">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <ul className="todo-list">
          {filteredTodos.length === 0 && (
            <li className="empty">No tasks here!</li>
          )}
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
              <input
                type="checkbox"
                className="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />

              {editingId === todo.id ? (
                <input
                  className="edit-input"
                  type="text"
                  value={editText}
                  autoFocus
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(todo.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={() => saveEdit(todo.id)}
                />
              ) : (
                <span className="todo-text" onDoubleClick={() => startEdit(todo)}>
                  {todo.text}
                </span>
              )}

              <div className="actions">
                <button
                  className="icon-btn edit"
                  title="Edit"
                  onClick={() => startEdit(todo)}
                >
                  ✏️
                </button>
                <button
                  className="icon-btn delete"
                  title="Delete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="footer">
          <span className="count">{activeCount} item{activeCount !== 1 ? "s" : ""} left</span>
          {todos.some((t) => t.completed) && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
