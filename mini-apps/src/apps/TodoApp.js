import React, { useState, useEffect } from 'react';

const PRIORITIES = { high: { label: 'High', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' }, medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' }, low: { label: 'Low', color: '#10b981', bg: 'rgba(16,185,129,0.15)' } };

export default function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('todos')) || []; } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => { localStorage.setItem('todos', JSON.stringify(tasks)); }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(t => [{ id: Date.now(), text: input.trim(), done: false, priority, dueDate, createdAt: new Date().toLocaleDateString() }, ...t]);
    setInput(''); setDueDate('');
  };

  const toggle = (id) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const remove = (id) => setTasks(t => t.filter(x => x.id !== id));
  const clearDone = () => setTasks(t => t.filter(x => !x.done));
  const move = (id, dir) => {
    const idx = tasks.findIndex(t => t.id === id);
    const n = [...tasks];
    const swp = idx + dir;
    if (swp < 0 || swp >= n.length) return;
    [n[idx], n[swp]] = [n[swp], n[idx]];
    setTasks(n);
  };
  const saveEdit = (id) => {
    setTasks(t => t.map(x => x.id === id ? { ...x, text: editText } : x));
    setEditId(null);
  };

  const filtered = tasks.filter(t => {
    const matchFilter = filter === 'all' || (filter === 'active' ? !t.done : t.done);
    const matchP = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchS = t.text.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchP && matchS;
  });

  const s = {
    wrap: { minHeight: '100vh', background: 'linear-gradient(135deg,#1a0533,#0d1b4b)', padding: '32px 20px', fontFamily: 'Segoe UI,sans-serif' },
    card: { maxWidth: 700, margin: '0 auto', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.1)' },
    title: { fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 4 },
    stats: { display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' },
    stat: (color) => ({ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 10, padding: '6px 14px', fontSize: 13, color: color }),
    inputRow: { display: 'flex', gap: 10, marginBottom: 12 },
    inp: { flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none' },
    addBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
    priRow: { display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' },
    priBtn: (p, active) => ({ background: active ? PRIORITIES[p].bg : 'rgba(255,255,255,0.05)', border: `1px solid ${active ? PRIORITIES[p].color : 'rgba(255,255,255,0.1)'}`, color: active ? PRIORITIES[p].color : '#94a3b8', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }),
    dateInp: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' },
    filterRow: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
    filterBtn: (active) => ({ background: active ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'rgba(255,255,255,0.07)', color: active ? '#fff' : '#94a3b8', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }),
    searchInp: { width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', color: '#fff', fontSize: 14, outline: 'none', marginBottom: 16 },
    taskItem: (done, p) => ({ background: done ? 'rgba(255,255,255,0.03)' : PRIORITIES[p].bg, border: `1px solid ${done ? 'rgba(255,255,255,0.07)' : PRIORITIES[p].color + '33'}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, opacity: done ? 0.6 : 1, transition: 'all 0.2s' }),
    checkbox: (done, p) => ({ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? PRIORITIES[p].color : 'rgba(255,255,255,0.3)'}`, background: done ? PRIORITIES[p].color : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }),
    taskText: (done) => ({ flex: 1, color: done ? '#64748b' : '#e2e8f0', textDecoration: done ? 'line-through' : 'none', fontSize: 15 }),
    badge: (p) => ({ background: PRIORITIES[p].bg, color: PRIORITIES[p].color, border: `1px solid ${PRIORITIES[p].color}44`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, flexShrink: 0 }),
    iconBtn: (color) => ({ background: 'transparent', border: 'none', color: color || '#94a3b8', cursor: 'pointer', fontSize: 16, padding: '2px 6px', borderRadius: 6 }),
    clearBtn: { background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginTop: 12 },
    editInp: { flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid #7c3aed', borderRadius: 8, padding: '6px 12px', color: '#fff', fontSize: 15, outline: 'none' },
    saveBtn: { background: '#7c3aed', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 700 },
  };

  const done = tasks.filter(t => t.done).length;
  const active = tasks.filter(t => !t.done).length;

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.title}>✅ To-Do App</div>
        <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 14 }}>Stay organized, stay productive</p>
        <div style={s.stats}>
          <span style={s.stat('#a78bfa')}>📋 Total: {tasks.length}</span>
          <span style={s.stat('#10b981')}>✅ Done: {done}</span>
          <span style={s.stat('#3b82f6')}>⏳ Active: {active}</span>
          <span style={s.stat('#ef4444')}>🔥 High: {tasks.filter(t => t.priority === 'high').length}</span>
        </div>
        <div style={s.inputRow}>
          <input style={s.inp} placeholder="Add a new task..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} />
          <button style={s.addBtn} onClick={addTask}>+ Add</button>
        </div>
        <div style={s.priRow}>
          <span style={{ color: '#94a3b8', fontSize: 13 }}>Priority:</span>
          {Object.keys(PRIORITIES).map(p => (
            <button key={p} style={s.priBtn(p, priority === p)} onClick={() => setPriority(p)}>{PRIORITIES[p].label}</button>
          ))}
          <input type="date" style={s.dateInp} value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <input style={s.searchInp} placeholder="🔍 Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={s.filterRow}>
          {['all', 'active', 'completed'].map(f => (
            <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
          <span style={{ color: '#64748b', margin: '0 4px' }}>|</span>
          {['all', 'high', 'medium', 'low'].map(p => (
            <button key={p} style={s.filterBtn(priorityFilter === p)} onClick={() => setPriorityFilter(p)}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
          ))}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#64748b', padding: 32, fontSize: 15 }}>No tasks found 🎉</div>}
        {filtered.map(task => (
          <div key={task.id} style={s.taskItem(task.done, task.priority)}>
            <div style={s.checkbox(task.done, task.priority)} onClick={() => toggle(task.id)}>{task.done && '✓'}</div>
            {editId === task.id ? (
              <>
                <input style={s.editInp} value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEdit(task.id)} autoFocus />
                <button style={s.saveBtn} onClick={() => saveEdit(task.id)}>Save</button>
                <button style={s.saveBtn} onClick={() => setEditId(null)}>✕</button>
              </>
            ) : (
              <>
                <div style={{ flex: 1 }}>
                  <div style={s.taskText(task.done)}>{task.text}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                    Added: {task.createdAt}{task.dueDate && ` · Due: ${task.dueDate}`}
                  </div>
                </div>
                <span style={s.badge(task.priority)}>{PRIORITIES[task.priority].label}</span>
                <button style={s.iconBtn('#a78bfa')} title="Move up" onClick={() => move(task.id, -1)}>↑</button>
                <button style={s.iconBtn('#a78bfa')} title="Move down" onClick={() => move(task.id, 1)}>↓</button>
                <button style={s.iconBtn('#60a5fa')} title="Edit" onClick={() => { setEditId(task.id); setEditText(task.text); }}>✏️</button>
                <button style={s.iconBtn('#ef4444')} title="Delete" onClick={() => remove(task.id)}>🗑</button>
              </>
            )}
          </div>
        ))}
        {done > 0 && <button style={s.clearBtn} onClick={clearDone}>🗑 Clear {done} completed task{done > 1 ? 's' : ''}</button>}
      </div>
    </div>
  );
}
