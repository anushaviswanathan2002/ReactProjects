/**
 * @jest-environment jsdom
 */

// Mock localStorage before any imports
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock confirm dialog
global.confirm = jest.fn(() => true);

// ===========================
// COMPONENT MOCKS FOR TESTING
// ===========================

// Re-export components from App for testing
const { 
  validateNote, 
  getCategoryColor,
  NotesList,
  NoteEditor,
  NotesStats,
  App
} = require('./App');

// ===========================
// HELPER FUNCTIONS
// ===========================

const createMockNote = (overrides = {}) => ({
  id: Date.now() + Math.random(),
  title: 'Test Note',
  content: 'Test content',
  category: 'personal',
  priority: 'normal',
  createdAt: Date.now(),
  tags: [],
  ...overrides
});

// ===========================
// TEST SUITE: App Component
// ===========================

describe('App Component', () => {
  let AppComponent;
  
  beforeEach(() => {
    localStorage.clear();
    localStorage.getItem.mockReturnValue(null);
    jest.clearAllMocks();
    AppComponent = require('./App').default;
  });

  test('renders without crashing', () => {
    const { container } = require('@testing-library/react').render(
      require('@testing-library/react').act(() => <AppComponent />)
    );
    expect(container.textContent).toContain('Notes App');
  });

  test('displays navigation buttons', () => {
    const { screen } = require('@testing-library/react');
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(<AppComponent />);
    });
    expect(screen.getByText('List View')).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  test('switches between views correctly', () => {
    const { screen, getByText } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(<AppComponent />);
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.click(getByText('List View'));
    });
    expect(screen.getByText('Notes List')).toBeInTheDocument();

    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.click(getByText('Editor'));
    });
    expect(screen.getByText('Note Editor')).toBeInTheDocument();

    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.click(getByText('Statistics'));
    });
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  test('displays quick add button', () => {
    const { screen } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(<AppComponent />);
    });
    
    expect(screen.getByLabelText('Add new note')).toBeInTheDocument();
  });

  test('quick add button navigates to editor', () => {
    const { screen } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(<AppComponent />);
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.click(screen.getByLabelText('Add new note'));
    });
    expect(screen.getByText('Note Editor')).toBeInTheDocument();
  });
});

// ===========================
// TEST SUITE: NotesList Component
// ===========================

describe('NotesList Component', () => {
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty state when no notes', () => {
    const { screen } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={[]} onDelete={mockOnDelete} onEdit={mockOnEdit} />
      );
    });
    
    expect(screen.getByText('No notes found')).toBeInTheDocument();
  });

  test('renders notes correctly', () => {
    const { screen } = require('@testing-library/react');
    const notes = [
      createMockNote({ id: 1, title: 'Note 1' }),
      createMockNote({ id: 2, title: 'Note 2' })
    ];
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={notes} onDelete={mockOnDelete} onEdit={mockOnEdit} />
      );
    });
    
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });

  test('filters notes by search term', () => {
    const { screen, getByPlaceholderText } = require('@testing-library/react');
    const notes = [
      createMockNote({ id: 1, title: 'Shopping List' }),
      createMockNote({ id: 2, title: 'Work Tasks' })
    ];
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={notes} onDelete={mockOnDelete} onEdit={mockOnEdit} />
      );
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.change(getByPlaceholderText('Search notes...'), { target: { value: 'Shopping' } });
    });
    
    expect(screen.getByText('Shopping List')).toBeInTheDocument();
    expect(screen.queryByText('Work Tasks')).not.toBeInTheDocument();
  });

  test('filters notes by category', () => {
    const { screen, getByLabelText } = require('@testing-library/react');
    const notes = [
      createMockNote({ id: 1, title: 'Work Note', category: 'work' }),
      createMockNote({ id: 2, title: 'Personal Note', category: 'personal' })
    ];
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={notes} onDelete={mockOnDelete} onEdit={mockOnEdit} />
      );
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.change(getByLabelText('Filter by category'), { target: { value: 'work' } });
    });
    
    expect(screen.getByText('Work Note')).toBeInTheDocument();
    expect(screen.queryByText('Personal Note')).not.toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked', () => {
    const { screen, getByLabelText } = require('@testing-library/react');
    const note = createMockNote({ id: 1, title: 'Test Note' });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={[note]} onDelete={mockOnDelete} onEdit={mockOnEdit} />
      );
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.click(getByLabelText('Delete Test Note'));
    });
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('calls onEdit when edit button is clicked', () => {
    const { screen, getByLabelText } = require('@testing-library/react');
    const note = createMockNote({ id: 1, title: 'Test Note' });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={[note]} onDelete={mockOnDelete} onEdit={mockOnEdit} />
      );
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.click(getByLabelText('Edit Test Note'));
    });
    
    expect(mockOnEdit).toHaveBeenCalledWith(note);
  });
});

// ===========================
// TEST SUITE: NoteEditor Component
// ===========================

describe('NoteEditor Component', () => {
  const mockOnSave = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders in create mode by default', () => {
    const { screen } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NoteEditor onSave={mockOnSave} onDelete={mockOnDelete} onCancel={mockOnCancel} />
      );
    });
    
    expect(screen.getByText('Note Editor')).toBeInTheDocument();
    expect(screen.getByText('Save Note')).toBeInTheDocument();
  });

  test('renders in edit mode when initialNote is provided', () => {
    const { screen } = require('@testing-library/react');
    const note = createMockNote({ id: 1, title: 'Edit Me' });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NoteEditor initialNote={note} onSave={mockOnSave} onDelete={mockOnDelete} onCancel={mockOnCancel} />
      );
    });
    
    expect(screen.getByText('Edit Note')).toBeInTheDocument();
    expect(screen.getByText('Update Note')).toBeInTheDocument();
  });

  test('validates empty title', () => {
    const { screen, getByLabelText, getByText } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NoteEditor onSave={mockOnSave} onDelete={mockOnDelete} />
      );
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.change(getByLabelText('Title'), { target: { value: '' } });
      require('@testing-library/react').fireEvent.click(getByText('Save Note'));
    });
    
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('validates title length', () => {
    const { screen, getByLabelText, getByText } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NoteEditor onSave={mockOnSave} onDelete={mockOnDelete} />
      );
    });
    
    const longTitle = 'a'.repeat(101);
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.change(getByLabelText('Title'), { target: { value: longTitle } });
      require('@testing-library/react').fireEvent.click(getByText('Save Note'));
    });
    
    expect(screen.getByText('Title must be less than 100 characters')).toBeInTheDocument();
  });

  test('calls onSave with valid data', () => {
    const { getByLabelText, getByText } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NoteEditor onSave={mockOnSave} onDelete={mockOnDelete} />
      );
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.change(getByLabelText('Title'), { target: { value: 'My Note' } });
      require('@testing-library/react').fireEvent.change(getByLabelText('Content'), { target: { value: 'My content' } });
      require('@testing-library/react').fireEvent.click(getByText('Save Note'));
    });
    
    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'My Note',
      content: 'My content',
      category: 'personal'
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    const { getByText } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NoteEditor onSave={mockOnSave} onDelete={mockOnDelete} onCancel={mockOnCancel} />
      );
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.click(getByText('Cancel'));
    });
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('displays character count', () => {
    const { screen, getByLabelText } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NoteEditor onSave={mockOnSave} onDelete={mockOnDelete} />
      );
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.change(getByLabelText('Title'), { target: { value: 'Test' } });
    });
    
    expect(screen.getByText('4/100 characters')).toBeInTheDocument();
  });
});

// ===========================
// TEST SUITE: NotesStats Component
// ===========================

describe('NotesStats Component', () => {
  test('displays empty state message when no notes', () => {
    const { screen } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(<NotesStats notes={[]} />);
    });
    
    expect(screen.getByText('No notes yet. Start creating!')).toBeInTheDocument();
  });

  test('displays correct message for few notes', () => {
    const { screen } = require('@testing-library/react');
    const notes = [createMockNote({ id: 1 })];
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(<NotesStats notes={notes} />);
    });
    
    expect(screen.getByText('You have few notes')).toBeInTheDocument();
  });

  test('displays correct message for many notes', () => {
    const { screen } = require('@testing-library/react');
    const notes = Array.from({ length: 55 }, (_, i) => createMockNote({ id: i }));
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(<NotesStats notes={notes} />);
    });
    
    expect(screen.getByText('Wow, you have 55 notes!')).toBeInTheDocument();
  });

  test('displays total note count', () => {
    const { screen } = require('@testing-library/react');
    const notes = [
      createMockNote({ id: 1, category: 'work' }),
      createMockNote({ id: 2, category: 'work' }),
      createMockNote({ id: 3, category: 'personal' })
    ];
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(<NotesStats notes={notes} />);
    });
    
    expect(screen.getByText('Total Notes:')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('displays category breakdown', () => {
    const { screen } = require('@testing-library/react');
    const notes = [
      createMockNote({ id: 1, category: 'work' }),
      createMockNote({ id: 2, category: 'work' }),
      createMockNote({ id: 3, category: 'personal' })
    ];
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(<NotesStats notes={notes} />);
    });
    
    expect(screen.getByText('Work:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Personal:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});

// ===========================
// TEST SUITE: Validation Function
// ===========================

describe('Note Validation', () => {
  test('validates valid note', () => {
    const note = createMockNote({ title: 'Valid Note' });
    const result = validateNote(note);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  test('rejects empty title', () => {
    const note = createMockNote({ title: '' });
    const result = validateNote(note);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Title cannot be empty');
  });

  test('rejects whitespace-only title', () => {
    const note = createMockNote({ title: '   ' });
    const result = validateNote(note);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Title cannot be empty');
  });

  test('rejects content exceeding max length', () => {
    const note = createMockNote({ content: 'a'.repeat(1001) });
    const result = validateNote(note);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Content exceeds maximum length');
  });

  test('rejects invalid note structure', () => {
    const result = validateNote(null);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid note structure');
  });

  test('rejects note without title property', () => {
    const result = validateNote({ content: 'test' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid note structure');
  });

  test('accepts note without content', () => {
    const note = createMockNote({ title: 'Title Only', content: undefined });
    const result = validateNote(note);
    expect(result.valid).toBe(true);
  });

  test('accepts note at max content length', () => {
    const note = createMockNote({ content: 'a'.repeat(1000) });
    const result = validateNote(note);
    expect(result.valid).toBe(true);
  });
});

// ===========================
// TEST SUITE: Category Color Function
// ===========================

describe('getCategoryColor', () => {
  test('returns correct color for work category with high priority', () => {
    expect(getCategoryColor('work', 'high')).toBe('#ff0000');
  });

  test('returns correct color for work category with normal priority', () => {
    expect(getCategoryColor('work', 'normal')).toBe('#ff6600');
  });

  test('returns correct color for personal category', () => {
    expect(getCategoryColor('personal', 'normal')).toBe('#00ff00');
  });

  test('returns correct color for shopping category', () => {
    expect(getCategoryColor('shopping', 'normal')).toBe('#0066ff');
  });

  test('returns correct color for ideas category', () => {
    expect(getCategoryColor('ideas', 'normal')).toBe('#9c27b0');
  });

  test('returns default color for unknown category', () => {
    expect(getCategoryColor('unknown', 'normal')).toBe('#666666');
  });
});

// ===========================
// TEST SUITE: Edge Cases
// ===========================

describe('Edge Cases', () => {
  test('handles notes with special characters in title', () => {
    const { container } = require('@testing-library/react');
    const notes = [
      createMockNote({ id: 1, title: 'Note with <script>alert("xss")</script>' })
    ];
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={notes} onDelete={jest.fn()} onEdit={jest.fn()} />
      );
    });
    
    expect(container.querySelector('h3').textContent).toBe('Note with <script>alert("xss")</script>');
  });

  test('handles notes with unicode characters', () => {
    const { screen } = require('@testing-library/react');
    const notes = [
      createMockNote({ id: 1, title: '日本語ノート 🗒️' })
    ];
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={notes} onDelete={jest.fn()} onEdit={jest.fn()} />
      );
    });
    
    expect(screen.getByText('日本語ノート 🗒️')).toBeInTheDocument();
  });

  test('handles empty search input', () => {
    const { screen, getByPlaceholderText } = require('@testing-library/react');
    const notes = [
      createMockNote({ id: 1, title: 'Note 1' }),
      createMockNote({ id: 2, title: 'Note 2' })
    ];
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={notes} onDelete={jest.fn()} onEdit={jest.fn()} />
      );
    });
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').fireEvent.change(getByPlaceholderText('Search notes...'), { target: { value: '' } });
    });
    
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });
});

// ===========================
// TEST SUITE: Accessibility
// ===========================

describe('Accessibility', () => {
  test('search input has proper label', () => {
    const { screen } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={[]} onDelete={jest.fn()} onEdit={jest.fn()} />
      );
    });
    
    expect(screen.getByLabelText('Search notes')).toBeInTheDocument();
  });

  test('category select has proper label', () => {
    const { screen } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NotesList notes={[]} onDelete={jest.fn()} onEdit={jest.fn()} />
      );
    });
    
    expect(screen.getByLabelText('Filter by category')).toBeInTheDocument();
  });

  test('title input has proper label', () => {
    const { screen } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NoteEditor onSave={jest.fn()} />
      );
    });
    
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  test('content textarea has proper label', () => {
    const { screen } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NoteEditor onSave={jest.fn()} />
      );
    });
    
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
  });

  test('category select has proper label', () => {
    const { screen } = require('@testing-library/react');
    
    require('@testing-library/react').act(() => {
      require('@testing-library/react').render(
        <NoteEditor onSave={jest.fn()} />
      );
    });
    
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });
});