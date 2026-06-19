import { useMemo, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const isEven = useMemo(() => count % 2 === 0, [count])

  return (
    <main className="app">
      <h1>Counter</h1>

      <p className="value" aria-live="polite">
        {count}
      </p>

      <p className="meta">{isEven ? 'Even' : 'Odd'}</p>

      <div className="controls" role="group" aria-label="Counter controls">
        <button type="button" onClick={() => setCount((c) => c - 1)}>
          −
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Reset
        </button>
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          +
        </button>
      </div>
    </main>
  )
}

export default App
