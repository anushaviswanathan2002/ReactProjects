import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Filter = 'all' | 'active' | 'completed'

type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

const STORAGE_KEY = 'todo-app.todos.v1'

function uid() {
  // Good-enough unique id for a local demo app
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Todo[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((t) => t && typeof t.id === 'string')
      .map((t) => ({
        id: t.id,
        title: String((t as any).title ?? ''),
        completed: Boolean((t as any).completed),
        createdAt: Number((t as any).createdAt ?? Date.now()),
      }))
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const [filter, setFilter] = useState<Filter>('all')
  const [title, setTitle] = useState('')

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

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

  const remainingCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos])
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos])

  function addTodo() {
    const trimmed = title.trim()
    if (!trimmed) return

    const next: Todo = {
      id: uid(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    }

    setTodos((prev) => [next, ...prev])
    setTitle('')
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

  function toggleAll() {
    const shouldCompleteAll = remainingCount > 0
    setTodos((prev) => prev.map((t) => ({ ...t, completed: shouldCompleteAll })))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>To‑Do</h1>
        <p>Simple React + TypeScript to‑do list (saved to localStorage).</p>
      </header>

      <main className="content">
        <label className="srOnly" htmlFor="newTodo">
          New todo
        </label>

        <div className="row">
          <input
            id="newTodo"
            ref={inputRef}
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task…"
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTodo()
            }}
            autoComplete="off"
          />
          <button className="button" type="button" onClick={addTodo}>
            Add
          </button>
        </div>

        <div className="toolbar" aria-label="Todo controls">
          <div className="filters" role="group" aria-label="Filters">
            <button className="chip" type="button" onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>
              All
            </button>
            <button
              className="chip"
              type="button"
              onClick={() => setFilter('active')}
              aria-pressed={filter === 'active'}
            >
              Active
            </button>
            <button
              className="chip"
              type="button"
              onClick={() => setFilter('completed')}
              aria-pressed={filter === 'completed'}
            >
              Completed
            </button>
          </div>

          <div className="row" style={{ gap: 8 }}>
            <button className="button secondary" type="button" onClick={toggleAll} disabled={todos.length === 0}>
              Toggle all
            </button>
            <button
              className="button danger"
              type="button"
              onClick={clearCompleted}
              disabled={completedCount === 0}
              aria-disabled={completedCount === 0}
            >
              Clear completed
            </button>
          </div>

          <div className="meta" aria-live="polite">
            {remainingCount} remaining • {completedCount} completed
          </div>
        </div>

        <ul className="list" aria-label="Todo list">
          {visibleTodos.map((t) => (
            <li key={t.id} className="item">
              <input
                className="checkbox"
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTodo(t.id)}
                aria-label={t.completed ? `Mark ${t.title} as not completed` : `Mark ${t.title} as completed`}
              />
              <div className={t.completed ? 'title done' : 'title'}>{t.title}</div>
              <button className="iconButton" type="button" onClick={() => deleteTodo(t.id)} aria-label={`Delete ${t.title}`}>
                Delete
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && <p className="meta" style={{ marginTop: 16 }}>
          No todos yet — add one above.
        </p>}
      </main>

      <footer className="footer">
        <span>
          Tip: press <span className="kbd">Enter</span> to add.
        </span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}

export default App
