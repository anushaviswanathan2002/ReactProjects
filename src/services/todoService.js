// Todo service using localStorage

const getTodosKey = (userId) => `todos_${userId}`;

export const todoService = {
  // Get all todos for a user
  getTodos: (userId) => {
    const todos = localStorage.getItem(getTodosKey(userId));
    return todos ? JSON.parse(todos) : [];
  },

  // Add a new todo
  addTodo: (userId, title, description, priority, category) => {
    const todos = todoService.getTodos(userId);
    const newTodo = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: null,
      timeSpent: 0
    };

    todos.push(newTodo);
    localStorage.setItem(getTodosKey(userId), JSON.stringify(todos));
    return newTodo;
  },

  // Update a todo
  updateTodo: (userId, id, updates) => {
    const todos = todoService.getTodos(userId);
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) return null;

    todos[index] = { ...todos[index], ...updates };
    localStorage.setItem(getTodosKey(userId), JSON.stringify(todos));
    return todos[index];
  },

  // Delete a todo
  deleteTodo: (userId, id) => {
    const todos = todoService.getTodos(userId);
    const filtered = todos.filter(t => t.id !== id);
    localStorage.setItem(getTodosKey(userId), JSON.stringify(filtered));
    return true;
  },

  // Toggle todo completion
  toggleTodo: (userId, id) => {
    const todos = todoService.getTodos(userId);
    const todo = todos.find(t => t.id === id);

    if (todo) {
      todo.completed = !todo.completed;
      localStorage.setItem(getTodosKey(userId), JSON.stringify(todos));
    }

    return todo;
  }
};
