import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Filter = 'all' | 'active' | 'completed'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

const STORAGE_KEY = 'todo-react-app.todos.v1'

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Todo[]
      if (!Array.isArray(parsed)) return []
      return parsed
    } catch {
      return []
    }
  })
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const remainingCount = useMemo(
    () => todos.reduce((acc, t) => acc + (t.completed ? 0 : 1), 0),
    [todos],
  )
  const completedCount = todos.length - remainingCount

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed)
      case 'completed':
        return todos.filter((t) => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  function addTodo() {
    const value = text.trim()
    if (!value) return

    const todo: Todo = {
      id: crypto.randomUUID(),
      text: value,
      completed: false,
      createdAt: Date.now(),
    }

    setTodos((prev) => [todo, ...prev])
    setText('')
  }

  function toggleTodo(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  return (
    <div className="page">
      <main className="app" aria-label="To-do list app">
        <header className="header">
          <div>
            <h1>To-do</h1>
            <p className="subtitle">A simple, fast to-do list with filters and persistence.</p>
          </div>
        </header>

        <section className="card" aria-label="Add a new to-do">
          <form
            className="addRow"
            onSubmit={(e) => {
              e.preventDefault()
              addTodo()
            }}
          >
            <label className="srOnly" htmlFor="newTodo">
              New to-do
            </label>
            <input
              id="newTodo"
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a task…"
              autoComplete="off"
            />
            <button className="btn primary" type="submit">
              Add
            </button>
          </form>

          <div className="toolbar" role="toolbar" aria-label="Filters">
            <div className="segmented" aria-label="To-do filter">
              <button
                type="button"
                className={filter === 'all' ? 'seg active' : 'seg'}
                onClick={() => setFilter('all')}
                aria-pressed={filter === 'all'}
              >
                All
              </button>
              <button
                type="button"
                className={filter === 'active' ? 'seg active' : 'seg'}
                onClick={() => setFilter('active')}
                aria-pressed={filter === 'active'}
              >
                Active
              </button>
              <button
                type="button"
                className={filter === 'completed' ? 'seg active' : 'seg'}
                onClick={() => setFilter('completed')}
                aria-pressed={filter === 'completed'}
              >
                Completed
              </button>
            </div>

            <div className="counts" aria-label="Counts">
              <span>
                <strong>{remainingCount}</strong> left
              </span>
              <span className="dot" aria-hidden="true">
                ·
              </span>
              <span>
                <strong>{completedCount}</strong> done
              </span>
            </div>

            <button
              type="button"
              className="btn ghost"
              onClick={clearCompleted}
              disabled={completedCount === 0}
            >
              Clear completed
            </button>
          </div>
        </section>

        <section className="card" aria-label="To-do items">
          {visibleTodos.length === 0 ? (
            <div className="empty" role="status">
              {todos.length === 0 ? 'No tasks yet. Add your first one above.' : 'No tasks match this filter.'}
            </div>
          ) : (
            <ul className="list" aria-label="To-do list">
              {visibleTodos.map((t) => (
                <li key={t.id} className={t.completed ? 'item completed' : 'item'}>
                  <label className="itemMain">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTodo(t.id)}
                      aria-label={t.completed ? `Mark ${t.text} as not completed` : `Mark ${t.text} as completed`}
                    />
                    <span className="itemText">{t.text}</span>
                  </label>
                  <button className="btn danger" type="button" onClick={() => deleteTodo(t.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="footer">
          <span>Saved to your browser (localStorage).</span>
        </footer>
      </main>
    </div>
  )
}

export default App
