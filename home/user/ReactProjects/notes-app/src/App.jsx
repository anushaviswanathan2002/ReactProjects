import { useEffect, useMemo, useState } from 'react'
import './App.css'

function uid() {
  // good enough for a small demo app
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function formatDateTime(ts) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts))
  } catch {
    return new Date(ts).toLocaleString()
  }
}

const STORAGE_KEY = 'notes-app:v1'

export default function App() {
  const [notes, setNotes] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [selectedId, setSelectedId] = useState(() => null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    if (selectedId) return
    if (notes.length) setSelectedId(notes[0].id)
  }, [notes, selectedId])

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return notes
    return notes.filter((n) => {
      const hay = `${n.title}\n${n.body}`.toLowerCase()
      return hay.includes(q)
    })
  }, [notes, query])

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId],
  )

  function createNote() {
    const now = Date.now()
    const note = {
      id: uid(),
      title: 'Untitled note',
      body: '',
      createdAt: now,
      updatedAt: now,
    }
    setNotes((prev) => [note, ...prev])
    setSelectedId(note.id)
  }

  function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    setSelectedId((prev) => (prev === id ? null : prev))
  }

  function updateSelected(patch) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedId
          ? { ...n, ...patch, updatedAt: Date.now() }
          : n,
      ),
    )
  }

  function onSelect(id) {
    setSelectedId(id)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brandMark" aria-hidden="true">
            N
          </div>
          <div>
            <h1>Notes</h1>
            <p className="sub">A simple note-taking list</p>
          </div>
        </div>

        <div className="actions">
          <button type="button" className="btn primary" onClick={createNote}>
            New note
          </button>
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar" aria-label="Notes list">
          <label className="search">
            <span className="srOnly">Search notes</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes…"
              type="search"
            />
          </label>

          <ul className="noteList" role="list">
            {filteredNotes.length === 0 ? (
              <li className="empty">No notes found.</li>
            ) : (
              filteredNotes.map((n) => (
                <li key={n.id} className="noteRow">
                  <button
                    type="button"
                    className={
                      n.id === selectedId ? 'noteCard selected' : 'noteCard'
                    }
                    onClick={() => onSelect(n.id)}
                  >
                    <div className="noteTitle" title={n.title}>
                      {n.title || 'Untitled'}
                    </div>
                    <div className="noteMeta">
                      <span>{formatDateTime(n.updatedAt)}</span>
                      <span className="dot" aria-hidden="true">
                        ·
                      </span>
                      <span className="preview">{n.body || 'No content'}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="iconBtn"
                    aria-label={`Delete ${n.title || 'note'}`}
                    title="Delete"
                    onClick={() => deleteNote(n.id)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 3h6l1 2h5v2H3V5h5l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM6 9h2v9H6V9z" />
                    </svg>
                  </button>
                </li>
              ))
            )}
          </ul>
        </aside>

        <section className="editor" aria-label="Note editor">
          {!selectedNote ? (
            <div className="blank">
              <h2>No note selected</h2>
              <p>Create a new note or select one from the list.</p>
              <button type="button" className="btn" onClick={createNote}>
                Create your first note
              </button>
            </div>
          ) : (
            <div className="editorInner">
              <div className="fields">
                <label className="field">
                  <span className="label">Title</span>
                  <input
                    value={selectedNote.title}
                    onChange={(e) => updateSelected({ title: e.target.value })}
                    placeholder="Note title"
                  />
                </label>

                <label className="field">
                  <span className="label">Body</span>
                  <textarea
                    value={selectedNote.body}
                    onChange={(e) => updateSelected({ body: e.target.value })}
                    placeholder="Write your note…"
                    rows={12}
                  />
                </label>
              </div>

              <div className="status" role="status" aria-live="polite">
                <span>
                  Created: {formatDateTime(selectedNote.createdAt)}
                </span>
                <span>
                  Updated: {formatDateTime(selectedNote.updatedAt)}
                </span>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <span>
          Stored locally in your browser (LocalStorage). No account required.
        </span>
      </footer>
    </div>
  )
}
