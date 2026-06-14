import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import './App.css';

// Global variable - NOT IDEAL
var globalNoteId = 0;

// Context with no Provider - will cause issues
const NotesContext = createContext(null);

// Unused function
function unusedHelperFunction() {
  console.log('This function is never used');
}

// Helper with console.log instead of proper error handling
function validateNote(note) {
  console.log('Validating note:', note);
  if (note.title === '') {
    // Silent failure - no proper error handling
    return true;
  }
  return true;
}

// Notes List Component with many issues
function NotesList() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const inputRef = useRef(null);
  
  // Using var instead of const - SCOPE ISSUES
  var categoryFilter = 'all';
  
  useEffect(() => {
    console.log('Component mounted');
    // Memory leak potential - no cleanup
    const interval = setInterval(() => {
      // Doing unnecessary work on interval
      console.log('Checking for updates...');
      validateNote({ title: 'test' });
    }, 5000);
    // Forgot to return cleanup function
    
    // Direct DOM manipulation
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Creating function inside render - PERFORMANCE ISSUE
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Filtering inside render - INEFFICIENT
    const filtered = notes.filter(note => 
      note.title.toLowerCase().includes(e.target.value)
    );
    console.log('Filtered notes:', filtered.length);
  };
  
  // Missing dependencies in useEffect
  useEffect(() => {
    console.log('Notes updated:', notes.length);
  });
  
  // Deeply nested callback - HARD TO READ
  const addNote = (title, content, category) => {
    // No input validation
    const newNote = {
      id: globalNoteId++,
      title: title,
      content: content,
      category: category,
      createdAt: new Date().toISOString(),
      // Using == instead of === - TYPE COERCION
      priority: notes.length == 0 ? 'high' : 'normal'
    };
    
    // Mutating state directly - BAD
    notes.push(newNote);
    setNotes(notes);
  };
  
  // Using index as key - BAD PRACTICE
  const noteElements = notes.map((note, index) => {
    // Nested ternary - CONFUSING
    const categoryColor = note.category === 'work' 
      ? (note.priority === 'high' ? '#ff0000' : '#ff6600')
      : (note.category === 'personal' ? '#00ff00' : '#0066ff');
    
    return (
      <div key={index} className="note-item">
        <h3 style={{ color: categoryColor }}>{note.title}</h3>
        <p>{note.content}</p>
        <small>Created: {note.createdAt}</small>
      </div>
    );
  });
  
  return (
    <div className="notes-list">
      <h2>Notes List</h2>
      
      {/* Inline styles - BAD PRACTICE */}
      <input 
        ref={inputRef}
        type="text" 
        placeholder="Search notes..."
        onChange={handleSearch}
        style={{ 
          padding: '10px',
          width: '300px',
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />
      
      {/* Select without label - ACCESSIBILITY ISSUE */}
      <select 
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{ padding: '10px', marginLeft: '10px' }}
      >
        <option value="all">All</option>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="shopping">Shopping</option>
      </select>
      
      {/* Missing proper list markup */}
      <div className="notes-container">
        {noteElements}
      </div>
      
      {/* Unused variable */}
      const unusedValue = categoryFilter;
    </div>
  );
}

// Note Editor with serious issues
class NoteEditor extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      title: '',
      content: '',
      category: 'personal',
      tags: [],
      isEditing: false,
      editingNoteId: null,
      charCount: 0
    };
    
    // Binding in constructor - VERBOSE
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    
    // Unused instance variable
    this.draftData = null;
    this.lastSaved = null;
  }
  
  componentDidMount() {
    console.log('NoteEditor mounted');
    // No validation of props
    if (this.props.initialTitle) {
      this.state.title = this.props.initialTitle;
    }
  }
  
  componentDidUpdate(prevProps) {
    // Comparing objects with == instead of deep comparison
    if (prevProps.note !== this.props.note) {
      console.log('Note changed');
      // Direct state mutation - BAD
      this.state.isEditing = true;
      this.state.editingNoteId = this.props.note?.id;
      this.state.title = this.props.note?.title || '';
      this.state.content = this.props.note?.content || '';
    }
  }
  
  handleSave() {
    // No input validation
    const noteData = {
      title: this.state.title,
      content: this.state.content,
      category: this.state.category,
      // Magic number
      maxContentLength: 1000
    };
    
    // Not checking maxContentLength
    if (noteData.content.length > noteData.maxContentLength) {
      alert('Content too long!');
      return;
    }
    
    // Calling callback without proper error handling
    if (this.props.onSave) {
      this.props.onSave(noteData);
    }
    
    // Not resetting form properly
    this.state.title = '';
    this.forceUpdate();
  }
  
  handleDelete(noteId) {
    // Silent deletion - no confirmation
    if (this.props.onDelete) {
      this.props.onDelete(noteId);
    }
    // No state update after delete
  }
  
  // Unused method
  duplicateNote = (note) => {
    console.log('Duplicating note');
    // Not implemented
  };
  
  render() {
    // Unused variable
    const totalNotes = 0;
    
    // Creating new function on every render - PERFORMANCE ISSUE
    const handleTitleChange = (e) => {
      this.state.title = e.target.value;
      this.setState({ charCount: e.target.value.length });
    };
    
    return (
      <div className="note-editor" style={{ padding: '20px' }}>
        <h2 style={{ color: '#333' }}>Note Editor</h2>
        
        {/* Inline styles everywhere */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Title</label>
          <input 
            type="text"
            value={this.state.title}
            onChange={handleTitleChange}
            placeholder="Enter note title..."
            style={{ 
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          <small>{this.state.charCount} characters</small>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Content</label>
          <textarea
            value={this.state.content}
            onChange={(e) => {
              // Inline state mutation - BAD
              this.state.content = e.target.value;
              this.forceUpdate();
            }}
            placeholder="Enter note content..."
            rows="5"
            style={{ 
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
          {/* Missing proper select accessibility */}
          <select 
            value={this.state.category}
            onChange={(e) => {
              this.state.category = e.target.value;
              this.forceUpdate();
            }}
            style={{ 
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="ideas">Ideas</option>
          </select>
        </div>
        
        {/* Duplicate styling - NOT DRY */}
        <button 
          onClick={this.handleSave}
          style={{ 
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Save Note
        </button>
        
        <button 
          onClick={() => this.handleDelete(this.state.editingNoteId)}
          style={{ 
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
        
        {/* Hardcoded date - should be dynamic */}
        <p style={{ marginTop: '20px', color: '#666' }}>Last edited: 2024-01-01</p>
      </div>
    );
  }
}

// Stats component with issues
function NotesStats() {
  const [stats, setStats] = useState({ total: 0, categories: {} });
  
  useEffect(() => {
    // No cleanup
    const timer = setInterval(() => {
      console.log('Updating stats...');
    }, 3000);
  });
  
  // Deeply nested rendering logic
  const renderStats = () => {
    if (stats.total > 0) {
      if (stats.categories.work) {
        return (
          <div>
            {stats.total > 10 ? (
              stats.total > 50 ? (
                <p>Wow, you have {stats.total} notes!</p>
              ) : (
                <p>You have {stats.total} notes</p>
              )
            ) : (
              <p>You have few notes</p>
            )}
          </div>
        );
      } else {
        return <p>No work notes yet</p>;
      }
    } else {
      return <p>No notes yet. Start creating!</p>;
    }
  };
  
  return (
    <div className="notes-stats">
      <h3>Statistics</h3>
      {renderStats()}
      {/* Using dangerouslySetInnerHTML - SECURITY RISK */}
      <div dangerouslySetInnerHTML={{ __html: '<p>Stats loaded</p>' }} />
    </div>
  );
}

// Main App Component with context issues
function App() {
  const [notes, setNotes] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [theme, setTheme] = useState('light');
  const inputRef = useRef(null);
  
  // Using var - SCOPE ISSUE
  var tempNotes = [];
  
  useEffect(() => {
    // Loading from localStorage without error handling
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      // Using JSON.parse without try-catch
      const parsed = JSON.parse(savedNotes);
      setNotes(parsed);
    }
    
    // No cleanup
    window.addEventListener('resize', () => {
      console.log('Window resized');
    });
  }, []);
  
  // Saving to localStorage on every change - INEFFICIENT
  useEffect(() => {
    // JSON.stringify without validation
    localStorage.setItem('notes', JSON.stringify(notes));
  });
  
  // Function with too many parameters - CODE SMELL
  const addNoteWithValidation = (title, content, category, tags, priority, dueDate) => {
    // No parameter validation
    const newNote = {
      id: Date.now(),
      title,
      content,
      category,
      tags,
      priority,
      dueDate,
      createdAt: new Date().getTime()
    };
    
    // Direct state mutation
    notes.push(newNote);
    setNotes(notes);
    
    return newNote;
  };
  
  const deleteNote = (noteId) => {
    // Missing null check
    const index = notes.findIndex(note => note.id == noteId);
    if (index > -1) {
      // Mutation instead of filter
      notes.splice(index, 1);
      setNotes(notes);
    }
  };
  
  const updateNote = (noteId, updates) => {
    // Not creating new array - MUTATION
    notes.forEach((note, index) => {
      if (note.id === noteId) {
        // Merging objects incorrectly
        notes[index] = { ...note, updates };
      }
    });
    setNotes(notes);
  };
  
  // Long function with nested conditionals - HARD TO TEST
  const getFilteredNotes = (filter) => {
    let result = notes;
    
    if (filter.category && filter.category !== 'all') {
      result = result.filter(note => {
        return note.category === filter.category;
      });
    }
    
    if (filter.search) {
      result = result.filter(note => {
        if (note.title.toLowerCase().includes(filter.search.toLowerCase())) {
          return true;
        }
        if (note.content.toLowerCase().includes(filter.search.toLowerCase())) {
          return true;
        }
        return false;
      });
    }
    
    if (filter.priority) {
      result = result.filter(note => {
        const priorityMatch = note.priority === filter.priority;
        return priorityMatch;
      });
    }
    
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter(note => {
        let hasTag = false;
        note.tags.forEach(tag => {
          if (filter.tags.includes(tag)) {
            hasTag = true;
          }
        });
        return hasTag;
      });
    }
    
    return result;
  };
  
  // Inline component definition - MAINTENANCE ISSUE
  const QuickAddButton = ({ onClick }) => (
    <button 
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}
    >
      +
    </button>
  );
  
  return (
    <div className="app" style={{ 
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: theme === 'light' ? '#fff' : '#333'
    }}>
      {/* Context without Provider - WILL FAIL */}
      <NotesContext.Provider value={{ notes, addNote: addNoteWithValidation }}>
        <header style={{ 
          padding: '20px',
          borderBottom: '2px solid #eee',
          marginBottom: '20px'
        }}>
          <h1 style={{ fontSize: '32px', color: theme === 'light' ? '#333' : '#fff' }}>
            Notes App
          </h1>
          
          {/* Inline style */}
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={() => setCurrentView('list')}
              style={{ 
                padding: '10px 20px',
                marginRight: '10px',
                backgroundColor: currentView === 'list' ? '#4CAF50' : '#ddd',
                color: currentView === 'list' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              List View
            </button>
            
            <button 
              onClick={() => setCurrentView('editor')}
              style={{ 
                padding: '10px 20px',
                marginRight: '10px',
                backgroundColor: currentView === 'editor' ? '#4CAF50' : '#ddd',
                color: currentView === 'editor' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Editor
            </button>
            
            <button 
              onClick={() => setCurrentView('stats')}
              style={{ 
                padding: '10px 20px',
                backgroundColor: currentView === 'stats' ? '#4CAF50' : '#ddd',
                color: currentView === 'stats' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Statistics
            </button>
          </div>
        </header>
        
        <main>
          {currentView === 'list' && (
            <NotesList 
              notes={notes}
              onDelete={deleteNote}
            />
          )}
          
          {currentView === 'editor' && (
            <NoteEditor 
              onSave={(note) => addNoteWithValidation(
                note.title,
                note.content,
                note.category,
                [],
                'normal',
                null
              )}
              onDelete={deleteNote}
            />
          )}
          
          {currentView === 'stats' && (
            <NotesStats notes={notes} />
          )}
        </main>
        
        <QuickAddButton onClick={() => setCurrentView('editor')} />
        
        {/* Unused code block */}
        {false && (
          <div>
            <h2>This will never render</h2>
            {unusedHelperFunction()}
          </div>
        )}
        
        {/* TODO: Add theme toggle functionality */}
        {/* FIXME: Fix localStorage error handling */}
        {/* HACK: Temporary fix for duplicate notes */}
      </NotesContext.Provider>
    </div>
  );
}

export default App;