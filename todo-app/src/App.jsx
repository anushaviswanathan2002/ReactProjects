import { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Buy groceries", completed: false },
    { id: 2, text: "Read a book", completed: false },
  ]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }]);
    setInput("");
  };

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

  const clearCompleted = () => setTodos(todos.filter((t) => !t.completed));

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">My To-Do List</h1>

        {/* Input */}
        <div className="input-row">
          <input
            className="input"
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button className="btn btn-add" onClick={addTodo}>
            Add
          </button>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <p className="empty">No tasks here!</p>
        ) : (
          <ul className="todo-list">
            {filtered.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? "done" : ""}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="checkbox"
                />
                <span className="todo-text">{todo.text}</span>
                <button
                  className="btn btn-delete"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        {todos.length > 0 && (
          <div className="footer">
            <span className="count">{remaining} item{remaining !== 1 ? "s" : ""} left</span>

            <div className="filters">
              {["all", "active", "completed"].map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <button className="btn btn-clear" onClick={clearCompleted}>
              Clear done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
