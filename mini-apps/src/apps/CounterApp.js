import React, { useState } from 'react';

const defaultCounters = [
  { id: 1, name: 'Steps', value: 0, step: 1, min: 0, max: 10000, color: '#7c3aed' },
  { id: 2, name: 'Water Glasses', value: 0, step: 1, min: 0, max: 20, color: '#3b82f6' },
  { id: 3, name: 'Calories', value: 0, step: 50, min: 0, max: 5000, color: '#10b981' },
];

export default function CounterApp() {
  const [counters, setCounters] = useState(defaultCounters);
  const [newName, setNewName] = useState('');
  const [newStep, setNewStep] = useState(1);
  const [newMin, setNewMin] = useState(0);
  const [newMax, setNewMax] = useState(100);
  const [newColor, setNewColor] = useState('#f59e0b');
  const [histories, setHistories] = useState({ 1: [], 2: [], 3: [] });
  const [showAdd, setShowAdd] = useState(false);
  const nextId = () => Date.now();

  const updateCounter = (id, delta, label) => {
    setCounters(cs => cs.map(c => {
      if (c.id !== id) return c;
      const newVal = Math.min(c.max, Math.max(c.min, c.value + delta));
      if (newVal === c.value) return c;
      setHistories(h => ({ ...h, [id]: [{ label, val: newVal, time: new Date().toLocaleTimeString() }, ...(h[id] || [])].slice(0, 8) }));
      return { ...c, value: newVal };
    }));
  };

  const resetCounter = (id) => {
    setCounters(cs => cs.map(c => c.id === id ? { ...c, value: c.min } : c));
    setHistories(h => ({ ...h, [id]: [{ label: 'Reset', val: 0, time: new Date().toLocaleTimeString() }, ...(h[id] || [])].slice(0, 8) }));
  };

  const deleteCounter = (id) => {
    setCounters(cs => cs.filter(c => c.id !== id));
    setHistories(h => { const n = { ...h }; delete n[id]; return n; });
  };

  const addCounter = () => {
    if (!newName.trim()) return;
    const id = nextId();
    setCounters(cs => [...cs, { id, name: newName, value: Number(newMin), step: Number(newStep), min: Number(newMin), max: Number(newMax), color: newColor }]);
    setHistories(h => ({ ...h, [id]: [] }));
    setNewName(''); setNewStep(1); setNewMin(0); setNewMax(100); setNewColor('#f59e0b');
    setShowAdd(false);
  };

  const s = {
    wrap: { minHeight: '100vh', background: 'linear-gradient(135deg,#1a0533,#0d1b4b)', padding: '32px 20px', fontFamily: 'Segoe UI,sans-serif' },
    title: { textAlign: 'center', fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 8 },
    sub: { textAlign: 'center', color: '#94a3b8', marginBottom: 32, fontSize: 15 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' },
    card: (color) => ({ background: 'rgba(255,255,255,0.05)', border: `1px solid ${color}44`, borderRadius: 20, padding: 24, backdropFilter: 'blur(10px)', boxShadow: `0 8px 32px ${color}22` }),
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitle: (color) => ({ fontSize: 18, fontWeight: 700, color: '#fff', borderLeft: `4px solid ${color}`, paddingLeft: 10 }),
    delBtn: { background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 16 },
    valueDisplay: (color, pct) => ({ position: 'relative', textAlign: 'center', margin: '16px 0', padding: '24px 0', borderRadius: 16, background: `linear-gradient(135deg,${color}22,${color}11)`, border: `1px solid ${color}33`, overflow: 'hidden' }),
    valueBg: (color, pct) => ({ position: 'absolute', bottom: 0, left: 0, height: `${pct}%`, width: '100%', background: `${color}22`, transition: 'height 0.5s ease' }),
    valueNum: { position: 'relative', fontSize: 56, fontWeight: 900, color: '#fff', lineHeight: 1 },
    pctLabel: (color) => ({ position: 'relative', fontSize: 12, color: color, marginTop: 4 }),
    btnRow: { display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 },
    btn: (bg, color) => ({ background: bg, color: color || '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, fontSize: 16, cursor: 'pointer', flex: 1, transition: 'transform 0.1s', maxWidth: 100 }),
    stepLabel: { textAlign: 'center', fontSize: 12, color: '#94a3b8', marginBottom: 12 },
    histTitle: { fontSize: 12, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
    histItem: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    addBtn: { display: 'block', margin: '24px auto 0', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', color: '#fff', border: 'none', borderRadius: 14, padding: '12px 28px', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalCard: { background: '#1e1b4b', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 20, padding: 32, width: 360 },
    input: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 15, width: '100%', marginBottom: 12, outline: 'none' },
    label: { color: '#94a3b8', fontSize: 13, marginBottom: 4, display: 'block' },
    row: { display: 'flex', gap: 12 },
    modalBtns: { display: 'flex', gap: 10, marginTop: 8 },
  };

  return (
    <div style={s.wrap}>
      <h1 style={s.title}>🔢 Counter App</h1>
      <p style={s.sub}>Track anything that counts</p>
      <div style={s.grid}>
        {counters.map(c => {
          const pct = ((c.value - c.min) / (c.max - c.min)) * 100;
          const hist = histories[c.id] || [];
          return (
            <div key={c.id} style={s.card(c.color)}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle(c.color)}>{c.name}</span>
                <button style={s.delBtn} onClick={() => deleteCounter(c.id)}>✕</button>
              </div>
              <div style={s.valueDisplay(c.color, pct)}>
                <div style={s.valueBg(c.color, pct)} />
                <div style={s.valueNum}>{c.value}</div>
                <div style={s.pctLabel(c.color)}>{Math.round(pct)}% of max ({c.max})</div>
              </div>
              {c.value >= c.max && <div style={{ textAlign: 'center', color: '#fbbf24', fontSize: 12, marginBottom: 8 }}>⚠️ Maximum reached!</div>}
              {c.value <= c.min && c.value !== 0 && <div style={{ textAlign: 'center', color: '#60a5fa', fontSize: 12, marginBottom: 8 }}>ℹ️ At minimum value</div>}
              <div style={s.btnRow}>
                <button style={s.btn(`${c.color}33`, c.color)} onClick={() => updateCounter(c.id, -c.step, `-${c.step}`)}>−{c.step}</button>
                <button style={s.btn('rgba(239,68,68,0.2)', '#ef4444')} onClick={() => resetCounter(c.id)}>↺</button>
                <button style={s.btn(`linear-gradient(135deg,${c.color},${c.color}aa)`)} onClick={() => updateCounter(c.id, c.step, `+${c.step}`)}>+{c.step}</button>
              </div>
              <div style={s.stepLabel}>Step size: {c.step} | Range: {c.min}–{c.max}</div>
              {hist.length > 0 && (
                <div>
                  <div style={s.histTitle}>Recent Activity</div>
                  {hist.map((h, i) => (
                    <div key={i} style={s.histItem}>
                      <span>{h.label} → {h.val}</span>
                      <span>{h.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button style={s.addBtn} onClick={() => setShowAdd(true)}>+ Add New Counter</button>
      {showAdd && (
        <div style={s.modal} onClick={() => setShowAdd(false)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', marginBottom: 20, fontSize: 20 }}>New Counter</h3>
            <label style={s.label}>Name</label>
            <input style={s.input} placeholder="Counter name..." value={newName} onChange={e => setNewName(e.target.value)} />
            <div style={s.row}>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Min</label>
                <input style={s.input} type="number" value={newMin} onChange={e => setNewMin(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Max</label>
                <input style={s.input} type="number" value={newMax} onChange={e => setNewMax(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Step</label>
                <input style={s.input} type="number" value={newStep} min={1} onChange={e => setNewStep(e.target.value)} />
              </div>
            </div>
            <label style={s.label}>Color</label>
            <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} style={{ marginBottom: 16, height: 40, width: '100%', borderRadius: 8, border: 'none', cursor: 'pointer' }} />
            <div style={s.modalBtns}>
              <button style={{ ...s.btn('rgba(255,255,255,0.1)', '#94a3b8'), maxWidth: 'none', flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</button>
              <button style={{ ...s.btn('linear-gradient(135deg,#7c3aed,#3b82f6)'), maxWidth: 'none', flex: 1 }} onClick={addCounter}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
