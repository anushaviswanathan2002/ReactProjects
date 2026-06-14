import React, { useState, useEffect, useCallback, createContext, useMemo } from 'react';
import './App.css';

// Context for notes state management
const NotesContext = createContext(null);

// Validation helper function
function validateNote(note) {
  if (!note || typeof note.title !== 'string') {
    return { valid: false, error: 'Invalid note structure' };
  }
  if (note.title.trim() === '') {
    return { valid: false, error: 'Title cannot be empty' };
  }
  if (note.content && note.content.length > 1000) {
    return { valid: false, error: 'Content exceeds maximum length' };
  }
  return { valid: true, error: null };
}

// Category color mapping
const getCategoryColor = (category, priority) => {
  const colors = {
    work: priority === 'high' ? '#ff0000' : '#ff6600',
    personal: '#00ff00',
    shopping: '#0066ff',
    ideas: '#9c27b0'
  };
  return colors[category] || '#666666';
};

// Notes List Component - Fixed
function NotesList({ notes, onDelete, onEdit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const inputRef = React.useRef(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Filter notes efficiently using useMemo
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = searchTerm === '' || 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notes, searchTerm, selectedCategory]);
  
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);
  
  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
  }, []);

  return (
    <div className="notes-list">
      <h2>Notes List</h2>
      
      <div className="notes-controls">
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Search notes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          aria-label="Search notes"
        />
        
        <label htmlFor="category-filter" className="visually-hidden">Filter by category</label>
        <select 
          id="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="all">All</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="ideas">Ideas</option>
        </select>
      </div>
      
      <div className="notes-container">
        {filteredNotes.length === 0 ? (
          <p className="no-notes">No notes found</p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="note-item">
              <h3 style={{ color: getCategoryColor(note.category, note.priority) }}>{note.title}</h3>
              {note.content && <p>{note.content}</p>}
              <small>Created: {new Date(note.createdAt).toLocaleDateString()}</small>
              <div className="note-actions">
                <button 
                  onClick={() => onEdit(note)}
                  className="btn-edit"
                  aria-label={`Edit ${note.title}`}
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(note.id)}
                  className="btn-delete"
                  aria-label={`Delete ${note.title}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Note Editor - Converted to functional component
function NoteEditor({ initialNote, onSave, onDelete, onCancel }) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [category, setCategory] = useState(initialNote?.category || 'personal');
  const [charCount, setCharCount] = useState(0);
  const [errors, setErrors] = useState({});
  
  const isEditing = Boolean(initialNote?.id);
  
  const handleTitleChange = useCallback((e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setCharCount(newTitle.length);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: null }));
    }
  }, [errors.title]);
  
  const handleContentChange = useCallback((e) => {
    setContent(e.target.value);
  }, []);
  
  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
  }, []);
  
  const handleSave = useCallback(() => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (content.length > 1000) {
      newErrors.content = 'Content must be less than 1000 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const noteData = {
      title: title.trim(),
      content: content.trim(),
      category
    };
    
    const validation = validateNote(noteData);
    if (!validation.valid) {
      setErrors({ general: validation.error });
      return;
    }
    
    onSave(noteData);
    
    // Reset form
    setTitle('');
    setContent('');
    setCategory('personal');
    setCharCount(0);
    setErrors({});
  }, [title, content, category, onSave]);
  
  const handleDelete = useCallback(() => {
    if (initialNote?.id && onDelete) {
      if (window.confirm('Are you sure you want to delete this note?')) {
        onDelete(initialNote.id);
      }
    }
  }, [initialNote, onDelete]);

  return (
    <div className="note-editor">
      <h2>{isEditing ? 'Edit Note' : 'Note Editor'}</h2>
      
      {errors.general && (
        <div className="error-message" role="alert">
          {errors.general}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="note-title">Title</label>
        <input 
          id="note-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter note title..."
          className={errors.title ? 'input-error' : ''}
          aria-invalid={errors.title ? 'true' : 'false'}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
        <small className="char-count">{charCount}/100 characters</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="note-content">Content</label>
        <textarea
          id="note-content"
          value={content}
          onChange={handleContentChange}
          placeholder="Enter note content..."
          rows="5"
          className={errors.content ? 'input-error' : ''}
          aria-invalid={errors.content ? 'true' : 'false'}
        />
        {errors.content && <span className="error-text">{errors.content}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="note-category">Category</label>
        <select 
          id="note-category"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="ideas">Ideas</option>
        </select>
      </div>
      
      <div className="button-group">
        <button 
          onClick={handleSave}
          className="btn-primary"
        >
          {isEditing ? 'Update Note' : 'Save Note'}
        </button>
        
        {isEditing && (
          <button 
            onClick={handleDelete}
            className="btn-danger"
          >
            Delete
          </button>
        )}
        
        {onCancel && (
          <button 
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
      
      <p className="last-edited">Last edited: {new Date().toLocaleDateString()}</p>
    </div>
  );
}

// Notes Stats Component - Fixed
function NotesStats({ notes }) {
  const stats = useMemo(() => {
    const categoryCount = {};
    let total = notes.length;
    
    notes.forEach(note => {
      categoryCount[note.category] = (categoryCount[note.category] || 0) + 1;
    });
    
    return { total, categories: categoryCount };
  }, [notes]);
  
  const getNoteCountMessage = () => {
    if (stats.total === 0) {
      return 'No notes yet. Start creating!';
    }
    if (stats.total > 50) {
      return `Wow, you have ${stats.total} notes!`;
    }
    if (stats.total > 10) {
      return `You have ${stats.total} notes`;
    }
    return `You have few notes`;
  };

  return (
    <div className="notes-stats">
      <h3>Statistics</h3>
      <p>{getNoteCountMessage()}</p>
      
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Total Notes:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        {Object.entries(stats.categories).map(([category, count]) => (
          <div key={category} className="stat-item">
            <span className="stat-label">{category.charAt(0).toUpperCase() + category.slice(1)}:</span>
            <span className="stat-value">{count}</span>
          </div>
        ))}
      </div>
      
      <p className="stats-loaded">Stats loaded</p>
    </div>
  );
}

// Quick Add Button Component - Extracted to avoid inline component issues
function QuickAddButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="quick-add-button"
      aria-label="Add new note"
    >
      +
    </button>
  );
}

// Main App Component - Fixed
function App() {
  const [notes, setNotes] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [theme, setTheme] = useState('light');
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState(null);
  
  // Load notes from localStorage with proper error handling
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);
        if (Array.isArray(parsed)) {
          setNotes(parsed);
        }
      }
    } catch (err) {
      console.error('Error loading notes:', err);
      setError('Failed to load notes from storage');
    }
  }, []);
  
  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch (err) {
      console.error('Error saving notes:', err);
      setError('Failed to save notes');
    }
  }, [notes]);

  // Add note with proper immutability
  const addNote = useCallback((title, content, category) => {
    const newNote = {
      id: Date.now(),
      title,
      content,
      category,
      priority: notes.length === 0 ? 'high' : 'normal',
      createdAt: Date.now()
    };
    
    const validation = validateNote(newNote);
    if (!validation.valid) {
      setError(validation.error);
      return null;
    }
    
    setNotes(prevNotes => [...prevNotes, newNote]);
    return newNote;
  }, [notes.length]);
  
  // Update note with proper immutability
  const updateNote = useCallback((noteId, updates) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === noteId ? { ...note, ...updates } : note
      )
    );
  }, []);
  
  // Delete note with proper immutability
  const deleteNote = useCallback((noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  }, []);
  
  // Handle save from editor
  const handleSaveNote = useCallback((noteData) => {
    if (editingNote?.id) {
      updateNote(editingNote.id, noteData);
    } else {
      addNote(noteData.title, noteData.content, noteData.category);
    }
    setEditingNote(null);
    setCurrentView('list');
  }, [editingNote, updateNote, addNote]);
  
  // Handle edit initiation
  const handleEditNote = useCallback((note) => {
    setEditingNote(note);
    setCurrentView('editor');
  }, []);
  
  // Handle delete from editor
  const handleDeleteFromEditor = useCallback((noteId) => {
    deleteNote(noteId);
    setEditingNote(null);
    setCurrentView('list');
  }, [deleteNote]);
  
  // Handle cancel
  const handleCancel = useCallback(() => {
    setEditingNote(null);
    setCurrentView('list');
  }, []);
  
  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Filter notes function - simplified
  const getFilteredNotes = useCallback((filter) => {
    let result = [...notes];
    
    if (filter.category && filter.category !== 'all') {
      result = result.filter(note => note.category === filter.category);
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        (note.content && note.content.toLowerCase().includes(searchLower))
      );
    }
    
    if (filter.priority) {
      result = result.filter(note => note.priority === filter.priority);
    }
    
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter(note => 
        note.tags && filter.tags.some(tag => note.tags.includes(tag))
      );
    }
    
    return result;
  }, [notes]);

  const contextValue = useMemo(() => ({
    notes,
    addNote,
    getFilteredNotes
  }), [notes, addNote, getFilteredNotes]);

  return (
    <NotesContext.Provider value={contextValue}>
      <div className={`app app--${theme}`}>
        <header className="header">
          <h1 className="header-title">Notes App</h1>
          
          <div className="header-controls">
            <button 
              onClick={() => setCurrentView('list')}
              className={`nav-button ${currentView === 'list' ? 'nav-button--active' : ''}`}
            >
              List View
            </button>
            
            <button 
              onClick={() => setCurrentView('editor')}
              className={`nav-button ${currentView === 'editor' ? 'nav-button--active' : ''}`}
            >
              Editor
            </button>
            
            <button 
              onClick={() => setCurrentView('stats')}
              className={`nav-button ${currentView === 'stats' ? 'nav-button--active' : ''}`}
            >
              Statistics
            </button>
            
            <button 
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>
        
        {error && (
          <div className="error-banner" role="alert">
            {error}
            <button onClick={() => setError(null)} aria-label="Dismiss error">×</button>
          </div>
        )}
        
        <main className="main-content">
          {currentView === 'list' && (
            <NotesList 
              notes={notes}
              onDelete={deleteNote}
              onEdit={handleEditNote}
            />
          )}
          
          {currentView === 'editor' && (
            <NoteEditor 
              initialNote={editingNote}
              onSave={handleSaveNote}
              onDelete={handleDeleteFromEditor}
              onCancel={handleCancel}
            />
          )}
          
          {currentView === 'stats' && (
            <NotesStats notes={notes} />
          )}
        </main>
        
        <QuickAddButton onClick={() => setCurrentView('editor')} />
      </div>
    </NotesContext.Provider>
  );
}

export default App;