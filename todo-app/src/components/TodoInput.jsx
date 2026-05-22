import { useState } from 'react'

function TodoInput({ onAdd }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value)
    setValue('')
  }

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <button type="submit" className="add-btn">
        Add
      </button>
    </form>
  )
}

export default TodoInput
