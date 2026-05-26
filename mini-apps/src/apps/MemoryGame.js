import React, { useState, useEffect, useCallback } from 'react';

const EMOJIS = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐙','🦋','🌈','⭐','🎸','🎮','🍕','🍦','🎯','🔮'];

function createDeck(size) {
  const count = size / 2;
  const chosen = EMOJIS.slice(0, count);
  const deck = [...chosen, ...chosen].map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
  return deck.sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const [gridSize, setGridSize] = useState(16);
  const [cards, setCards] = useState(() => createDeck(16));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);
  const [bestScores, setBestScores] = useState({});

  useEffect(() => {
    let interval;
    if (running) interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const startGame = useCallback((size = gridSize) => {
    setCards(createDeck(size));
    setFlipped([]); setMoves(0); setMatches(0);
    setTimer(0); setRunning(false); setWon(false); setLocked(false);
  }, [gridSize]);

  const handleCardClick = (idx) => {
    if (locked || cards[idx].flipped || cards[idx].matched) return;
    if (!running) setRunning(true);
    const newCards = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    const newFlipped = [...flipped, idx];
    setCards(newCards);
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        setTimeout(() => {
          setCards(c => c.map((card, i) => i === a || i === b ? { ...card, matched: true } : card));
          const newMatches = matches + 1;
          setMatches(newMatches);
          setFlipped([]);
          setLocked(false);
          if (newMatches === gridSize / 2) {
            setRunning(false);
            setWon(true);
            setBestScores(bs => {
              const key = `size_${gridSize}`;
              const prev = bs[key];
              if (!prev || timer + 1 < prev.time || (timer + 1 === prev.time && moves + 1 < prev.moves)) {
                return { ...bs, [key]: { time: timer + 1, moves: moves + 1 } };
              }
              return bs;
            });
          }
        }, 600);
      } else {
        setTimeout(() => {
          setCards(c => c.map((card, i) => i === a || i === b ? { ...card, flipped: false } : card));
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const cols = gridSize === 16 ? 4 : gridSize === 24 ? 6 : 4;

  const s = {
    wrap: { minHeight: '100vh', background: 'linear-gradient(135deg,#1a0533,#0d1b4b)', padding: '28px 20px', fontFamily: 'Segoe UI,sans-serif' },
    header: { textAlign: 'center', marginBottom: 24 },
    title: { fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 },
    statsRow: { display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' },
    stat: (color) => ({ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 12, padding: '10px 18px', textAlign: 'center', minWidth: 90 }),
    statVal: (color) => ({ fontSize: 22, fontWeight: 800, color }),
    statLabel: { fontSize: 11, color: '#94a3b8' },
    sizeRow: { display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 },
    sizeBtn: (active) => ({ background: active ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'rgba(255,255,255,0.07)', color: active ? '#fff' : '#94a3b8', border: 'none', borderRadius: 10, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }),
    grid: (cols) => ({ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 10, maxWidth: cols === 6 ? 600 : 420, margin: '0 auto', marginBottom: 20 }),
    card: (flipped, matched) => ({
      aspectRatio: '1', borderRadius: 12, cursor: flipped || matched ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
      background: matched ? 'rgba(16,185,129,0.2)' : flipped ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(59,130,246,0.4))',
      border: `2px solid ${matched ? '#10b981' : flipped ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`,
      transform: flipped || matched ? 'rotateY(0deg)' : 'rotateY(180deg)',
      transition: 'all 0.3s ease', boxShadow: matched ? '0 0 16px rgba(16,185,129,0.4)' : 'none',
      userSelect: 'none',
    }),
    btnRow: { display: 'flex', justifyContent: 'center', gap: 10 },
    btn: (grad) => ({ background: grad, color: '#fff', border: 'none', borderRadius: 12, padding: '11px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }),
    wonBanner: { background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: 14, padding: '14px 20px', maxWidth: 420, margin: '0 auto 16px', textAlign: 'center' },
    progress: { maxWidth: 420, margin: '0 auto 16px', background: 'rgba(255,255,255,0.08)', borderRadius: 10, height: 10, overflow: 'hidden' },
    progressBar: { height: '100%', background: 'linear-gradient(90deg,#7c3aed,#10b981)', borderRadius: 10, transition: 'width 0.4s ease' },
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.title}>🧠 Memory Game</div>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Match all pairs to win!</p>
      </div>
      <div style={s.sizeRow}>
        {[{label:'4×4 (Easy)',size:16},{label:'6×4 (Medium)',size:24}].map(o => (
          <button key={o.size} style={s.sizeBtn(gridSize===o.size)} onClick={() => { setGridSize(o.size); startGame(o.size); }}>{o.label}</button>
        ))}
      </div>
      <div style={s.statsRow}>
        <div style={s.stat('#a78bfa')}><div style={s.statVal('#a78bfa')}>{formatTime(timer)}</div><div style={s.statLabel}>Time</div></div>
        <div style={s.stat('#3b82f6')}><div style={s.statVal('#3b82f6')}>{moves}</div><div style={s.statLabel}>Moves</div></div>
        <div style={s.stat('#10b981')}><div style={s.statVal('#10b981')}>{matches}/{gridSize/2}</div><div style={s.statLabel}>Pairs</div></div>
        {bestScores[`size_${gridSize}`] && (
          <div style={s.stat('#f59e0b')}><div style={s.statVal('#f59e0b')}>{bestScores[`size_${gridSize}`].moves}</div><div style={s.statLabel}>Best Moves</div></div>
        )}
      </div>
      <div style={s.progress}>
        <div style={{ ...s.progressBar, width: `${(matches / (gridSize/2)) * 100}%` }} />
      </div>
      {won && (
        <div style={s.wonBanner}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🎉</div>
          <div style={{ color: '#10b981', fontWeight: 800, fontSize: 20 }}>Congratulations!</div>
          <div style={{ color: '#e2e8f0', fontSize: 14, marginTop: 4 }}>Completed in {formatTime(timer)} with {moves} moves</div>
        </div>
      )}
      <div style={s.grid(cols)}>
        {cards.map((card, idx) => (
          <div key={card.id} style={s.card(card.flipped, card.matched)} onClick={() => handleCardClick(idx)}>
            {(card.flipped || card.matched) ? card.emoji : '❓'}
          </div>
        ))}
      </div>
      <div style={s.btnRow}>
        <button style={s.btn('linear-gradient(135deg,#7c3aed,#3b82f6)')} onClick={() => startGame()}>🔄 New Game</button>
      </div>
    </div>
  );
}
