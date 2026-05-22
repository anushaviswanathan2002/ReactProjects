import { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Buy groceries", completed: false },
    { id: 2, text: "Read a book", completed: false },
  ]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTodo();
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">My To-Do List</h1>
        <p className="subtitle">
          {remaining} task{remaining !== 1 ? "s" : ""} remaining
        </p>

        <div className="input-row">
          <input
            className="input"
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn-add" onClick={addTodo}>
            Add
          </button>
        </div>

        <ul className="todo-list">
          {todos.length === 0 && (
            <p className="empty">No tasks yet. Add one above!</p>
          )}
          {todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
              <input
                type="checkbox"
                className="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className="todo-text">{todo.text}</span>
              <button className="btn-delete" onClick={() => deleteTodo(todo.id)} aria-label="Delete task">
                ✕
              </button>
            </li>
          ))}
        </ul>

        {todos.some((t) => t.completed) && (
          <button
            className="btn-clear"
            onClick={() => setTodos(todos.filter((t) => !t.completed))}
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
