import { useEffect, useId, useMemo, useRef, useState } from 'react'
import './App.css'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

type Filter = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'todo-app.todos.v1'

function uid() {
  // good enough for client-side ids
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Todo[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((t) => t && typeof t.text === 'string')
      .map((t) => ({
        id: typeof t.id === 'string' ? t.id : uid(),
        text: t.text,
        completed: Boolean(t.completed),
        createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now(),
      }))
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function App() {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    saveTodos(todos)
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

  function addTodo() {
    const trimmed = text.trim()
    if (!trimmed) return

    setTodos((prev) => [
      {
        id: uid(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ])
    setText('')
    inputRef.current?.focus()
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

  function setAllCompleted(nextCompleted: boolean) {
    setTodos((prev) => prev.map((t) => ({ ...t, completed: nextCompleted })))
  }

  const allCompleted = todos.length > 0 && remainingCount === 0

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">To‑Do</h1>
          <p className="subtitle">A tiny, fast to-do list with filters and local storage.</p>
        </div>
      </header>

      <main className="card" aria-label="To-do app">
        <form
          className="addRow"
          onSubmit={(e) => {
            e.preventDefault()
            addTodo()
          }}
        >
          <label className="srOnly" htmlFor={inputId}>
            Add a new task
          </label>
          <input
            id={inputId}
            ref={inputRef}
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task…"
            autoComplete="off"
          />
          <button className="btn btnPrimary" type="submit">
            Add
          </button>
        </form>

        <div className="toolbar" role="region" aria-label="To-do controls">
          <div className="filters" role="tablist" aria-label="Filter tasks">
            <button
              type="button"
              className={`chip ${filter === 'all' ? 'chipActive' : ''}`}
              onClick={() => setFilter('all')}
              role="tab"
              aria-selected={filter === 'all'}
            >
              All
            </button>
            <button
              type="button"
              className={`chip ${filter === 'active' ? 'chipActive' : ''}`}
              onClick={() => setFilter('active')}
              role="tab"
              aria-selected={filter === 'active'}
            >
              Active
            </button>
            <button
              type="button"
              className={`chip ${filter === 'completed' ? 'chipActive' : ''}`}
              onClick={() => setFilter('completed')}
              role="tab"
              aria-selected={filter === 'completed'}
            >
              Completed
            </button>
          </div>

          <div className="counts" aria-live="polite">
            <span>
              {remainingCount} remaining{remainingCount === 1 ? '' : ''}
            </span>
          </div>

          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={() => setAllCompleted(!allCompleted)}
              disabled={todos.length === 0}
            >
              {allCompleted ? 'Mark all active' : 'Mark all done'}
            </button>
            <button
              type="button"
              className="btn"
              onClick={clearCompleted}
              disabled={todos.every((t) => !t.completed)}
            >
              Clear completed
            </button>
          </div>
        </div>

        <ul className="list" aria-label="To-do items">
          {visibleTodos.length === 0 ? (
            <li className="empty" aria-live="polite">
              {todos.length === 0 ? 'No tasks yet — add one above.' : 'No tasks in this filter.'}
            </li>
          ) : (
            visibleTodos.map((t) => (
              <li key={t.id} className="item">
                <label className="itemMain">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTodo(t.id)}
                    aria-label={`Mark ${t.text} as ${t.completed ? 'not completed' : 'completed'}`}
                  />
                  <span className={`itemText ${t.completed ? 'done' : ''}`}>{t.text}</span>
                </label>

                <button
                  type="button"
                  className="iconBtn"
                  onClick={() => deleteTodo(t.id)}
                  aria-label={`Delete ${t.text}`}
                  title="Delete"
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>

        <footer className="footer">
          <span className="muted">
            Tip: Press Enter to add. Tasks are saved in your browser.
          </span>
        </footer>
      </main>
    </div>
  )
}

export default App
