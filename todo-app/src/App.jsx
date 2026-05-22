import { useState } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import TodoFilter from './components/TodoFilter'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    }
    setTodos((prev) => [newTodo, ...prev])
  }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter((t) => !t.completed).length

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>My To-Do List</h1>
          <p className="subtitle">Stay organized, stay productive</p>
        </header>

        <TodoInput onAdd={addTodo} />

        <TodoFilter
          filter={filter}
          onFilterChange={setFilter}
          activeCount={activeCount}
          totalCount={todos.length}
        />

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />

        {todos.some((t) => t.completed) && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear Completed
          </button>
        )}

        {todos.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <p>No tasks yet. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
