import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all') // all | active | completed
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem('todos')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const remainingCount = useMemo(
    () => todos.reduce((acc, t) => acc + (t.completed ? 0 : 1), 0),
    [todos],
  )

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed)
    if (filter === 'completed') return todos.filter((t) => t.completed)
    return todos
  }, [todos, filter])

  function addTodo(e) {
    e.preventDefault()
    const title = newTodo.trim()
    if (!title) return

    setTodos((prev) => [
      { id: crypto.randomUUID(), title, completed: false },
      ...prev,
    ])
    setNewTodo('')
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>To-do list</h1>
        <p className="sub">
          {remainingCount} remaining • {todos.length} total
        </p>
      </header>

      <main className="card">
        <form className="add" onSubmit={addTodo}>
          <label className="sr-only" htmlFor="newTodo">
            New to-do
          </label>
          <input
            id="newTodo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a task…"
            autoComplete="off"
          />
          <button type="submit">Add</button>
        </form>

        <div className="toolbar" role="toolbar" aria-label="Filters">
          <div className="filters">
            <button
              type="button"
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              type="button"
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          <button
            type="button"
            className="link"
            onClick={clearCompleted}
            disabled={!todos.some((t) => t.completed)}
          >
            Clear completed
          </button>
        </div>

        {visibleTodos.length === 0 ? (
          <p className="empty">No items here.</p>
        ) : (
          <ul className="list" aria-label="To-do items">
            {visibleTodos.map((t) => (
              <li key={t.id} className={t.completed ? 'done' : ''}>
                <label className="item">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTodo(t.id)}
                  />
                  <span className="title">{t.title}</span>
                </label>

                <button
                  type="button"
                  className="icon"
                  onClick={() => deleteTodo(t.id)}
                  aria-label={`Delete ${t.title}`}
                  title="Delete"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="footer">
        <small>Tip: your list is saved in localStorage.</small>
      </footer>
    </div>
  )
}

export default App
