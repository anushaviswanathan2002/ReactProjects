import React, { useState, useEffect } from 'react';
import { todoService } from '../services/todoService';
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';
import StatsSection from '../components/StatsSection';
import EditTodoModal from '../components/EditTodoModal';

function TodoApp({ user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingTodo, setEditingTodo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load todos on component mount
  useEffect(() => {
    const loadedTodos = todoService.getTodos(user.id);
    setTodos(loadedTodos);
  }, [user.id]);

  // Handle adding a new todo
  const handleAddTodo = (title, description, priority, category) => {
    const newTodo = todoService.addTodo(
      user.id,
      title,
      description,
      priority,
      category
    );
    setTodos([...todos, newTodo]);
  };

  // Handle toggling todo completion
  const handleToggleTodo = (id) => {
    const updated = todoService.toggleTodo(user.id, id);
    setTodos(todos.map(t => t.id === id ? updated : t));
  };

  // Handle deleting a todo
  const handleDeleteTodo = (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      todoService.deleteTodo(user.id, id);
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  // Handle editing a todo
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowEditModal(true);
  };

  // Handle saving edited todo
  const handleSaveEdit = (updatedData) => {
    const updated = todoService.updateTodo(user.id, editingTodo.id, updatedData);
    setTodos(todos.map(t => t.id === editingTodo.id ? updated : t));
    setShowEditModal(false);
    setEditingTodo(null);
  };

  // Filter todos based on status and category
  const filteredTodos = todos.filter(todo => {
    let statusMatch = true;
    let categoryMatch = true;

    if (filter === 'active') statusMatch = !todo.completed;
    if (filter === 'completed') statusMatch = todo.completed;

    if (categoryFilter !== 'all') categoryMatch = todo.category === categoryFilter;

    return statusMatch && categoryMatch;
  });

  // Get unique categories
  const categories = ['all', ...new Set(todos.map(t => t.category).filter(Boolean))];

  // Calculate stats
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => !t.completed && t.priority === 'high').length
  };

  return (
    <div className="todo-app-container">
      <div className="todo-header">
        <div>
          <h1>My Memories & Todos</h1>
          <p className="welcome-text">Welcome, {user.name}!</p>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="todo-content">
        <AddTodoForm onAddTodo={handleAddTodo} />

        <div className="todos-list">
          <h2>My Tasks</h2>

          <div className="todo-filter">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({todos.length})
            </button>
            <button
              className={`filter-button ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({stats.active})
            </button>
            <button
              className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({stats.completed})
            </button>
          </div>

          {categories.length > 1 && (
            <div className="todo-filter">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-button ${categoryFilter === category ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          )}

          {filteredTodos.length === 0 ? (
            <div className="todos-empty">
              <div className="todos-empty-icon">📭</div>
              <p>
                {filter === 'all' ? 'No tasks yet. Create one to get started!' : `No ${filter} tasks.`}
              </p>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />
          )}
        </div>

        <StatsSection stats={stats} />
      </div>

      {showEditModal && editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          onSave={handleSaveEdit}
          onCancel={() => {
            setShowEditModal(false);
            setEditingTodo(null);
          }}
        />
      )}
    </div>
  );
}

export default TodoApp;
