import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onDelete, onEdit, onTimeUpdate }) {
  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onTimeUpdate={onTimeUpdate}
        />
      ))}
    </div>
  );
}

export default TodoList;
