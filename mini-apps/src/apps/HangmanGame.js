import React, { useState, useEffect, useCallback } from 'react';

const WORDS = [
  { word: 'JAVASCRIPT', hint: 'A popular programming language' },
  { word: 'ELEPHANT', hint: 'The largest land animal' },
  { word: 'PYRAMID', hint: 'Ancient Egyptian monument' },
  { word: 'UNIVERSE', hint: 'Everything that exists' },
  { word: 'BUTTERFLY', hint: 'A flying insect with colorful wings' },
  { word: 'KEYBOARD', hint: 'Input device for a computer' },
  { word: 'MOUNTAIN', hint: 'A large natural elevation of earth' },
  { word: 'CALENDAR', hint: 'Used to track days and months' },
  { word: 'LIGHTNING', hint: 'A natural electrical discharge' },
  { word: 'PENGUIN', hint: 'A flightless bird from Antarctica' },
  { word: 'CHOCOLATE', hint: 'A sweet food made from cacao' },
  { word: 'TELESCOPE', hint: 'Used to observe distant objects' },
  { word: 'VOLLEYBALL', hint: 'A team sport played with a net' },
  { word: 'DIAMOND', hint: 'The hardest natural material' },
  { word: 'ORCHESTRA', hint: 'A large group of musicians' },
];

const MAX_WRONG = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function getRandomWord() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }

function HangmanSVG({ wrong }) {
  const parts = [
    <line key="head-line" x1="100" y1="30" x2="100" y2="60" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />,
    <circle key="head" cx="100" cy="75" r="15" stroke="#ef4444" strokeWidth="3" fill="none" />,
    <line key="body" x1="100" y1="90" x2="100" y2="145" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />,
    <line key="left-arm" x1="100" y1="105" x2="70" y2="130" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />,
    <line key="right-arm" x1="100" y1="105" x2="130" y2="130" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />,
    <line key="left-leg" x1="100" y1="145" x2="70" y2="175" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />,
    <line key="right-leg" x1="100" y1="145" x2="130" y2="175" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />,
  ];
  return (
    <svg viewBox="0 0 200 200" style={{ width: 200, height: 200 }}>
      <line x1="20" y1="195" x2="180" y2="195" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="195" x2="50" y2="10" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="10" x2="100" y2="10" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="10" x2="100" y2="30" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      {parts.slice(0, wrong).map(p => p)}
    </svg>
  );
}

export default function HangmanGame() {
  const [wordData, setWordData] = useState(getRandomWord);
  const [guessed, setGuessed] = useState(new Set());
  const [wrongCount, setWrongCount] = useState(0); // eslint-disable-line no-unused-vars
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const [showHint, setShowHint] = useState(false);

  const { word, hint } = wordData;
  const wrongGuesses = [...guessed].filter(l => !word.includes(l));
  const revealed = word.split('').map(l => guessed.has(l) ? l : '_');
  const isWon = revealed.every(l => l !== '_');
  const isLost = wrongGuesses.length >= MAX_WRONG;

  useEffect(() => {
    if (isWon && !gameOver) { setWon(true); setGameOver(true); setStats(s => ({ ...s, wins: s.wins + 1 })); }
    if (isLost && !gameOver) { setWon(false); setGameOver(true); setStats(s => ({ ...s, losses: s.losses + 1 })); }
  }, [isWon, isLost, gameOver]);

  const guess = useCallback((letter) => {
    if (gameOver || guessed.has(letter)) return;
    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);
    if (!word.includes(letter)) setWrongCount(w => w + 1);
  }, [gameOver, guessed, word]);

  useEffect(() => {
    const handler = (e) => { const l = e.key.toUpperCase(); if (ALPHABET.includes(l)) guess(l); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [guess]);

  const newGame = () => { setWordData(getRandomWord()); setGuessed(new Set()); setWrongCount(0); setGameOver(false); setWon(false); setShowHint(false); };

  const s = {
    wrap: { minHeight: '100vh', background: 'linear-gradient(135deg,#1a0533,#0d1b4b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Segoe UI,sans-serif' },
    card: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32, maxWidth: 580, width: '100%', textAlign: 'center' },
    title: { fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 6 },
    statsRow: { display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 },
    stat: (color) => ({ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 10, padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center' }),
    statLabel: (color) => ({ color, fontWeight: 700 }),
    svgWrap: { display: 'flex', justifyContent: 'center', marginBottom: 16 },
    wrongBar: { display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 },
    wrongDot: (used) => ({ width: 14, height: 14, borderRadius: '50%', background: used ? '#ef4444' : 'rgba(255,255,255,0.1)', border: `1px solid ${used ? '#ef4444' : 'rgba(255,255,255,0.2)'}`, transition: 'all 0.3s' }),
    wordRow: { display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
    letterBox: (revealed) => ({ width: 38, height: 44, borderBottom: `3px solid ${revealed !== '_' ? '#a78bfa' : '#4b5563'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: revealed !== '_' ? '#fff' : 'transparent', transition: 'all 0.3s' }),
    keyboard: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 20, maxWidth: 420, margin: '0 auto 20px' },
    key: (state) => ({
      width: 38, height: 38, borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: state === 'none' ? 'pointer' : 'default',
      background: state === 'correct' ? 'rgba(16,185,129,0.3)' : state === 'wrong' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)',
      color: state === 'correct' ? '#10b981' : state === 'wrong' ? '#ef4444' : '#e2e8f0',
      border: `1px solid ${state === 'correct' ? '#10b981' : state === 'wrong' ? '#ef444433' : 'rgba(255,255,255,0.15)'}`,
      opacity: state !== 'none' ? 0.5 : 1, transition: 'all 0.2s',
    }),
    hintBtn: { background: 'rgba(245,158,11,0.2)', border: '1px solid #f59e0b', color: '#f59e0b', borderRadius: 10, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 12 },
    hint: { color: '#fcd34d', fontSize: 14, marginBottom: 16, background: 'rgba(245,158,11,0.1)', borderRadius: 10, padding: '8px 16px' },
    resultBanner: (won) => ({ background: won ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${won ? '#10b981' : '#ef4444'}`, borderRadius: 12, padding: '14px 20px', marginBottom: 16, color: won ? '#10b981' : '#ef4444', fontWeight: 700, fontSize: 18 }),
    newBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.title}>🪢 Hangman</div>
        <div style={s.statsRow}>
          <div style={s.stat('#10b981')}><span>🏆</span><span style={s.statLabel('#10b981')}>Wins: {stats.wins}</span></div>
          <div style={s.stat('#ef4444')}><span>💀</span><span style={s.statLabel('#ef4444')}>Losses: {stats.losses}</span></div>
          <div style={s.stat('#a78bfa')}><span>🔤</span><span style={s.statLabel('#a78bfa')}>{MAX_WRONG - wrongGuesses.length} left</span></div>
        </div>
        <div style={s.svgWrap}><HangmanSVG wrong={wrongGuesses.length} /></div>
        <div style={s.wrongBar}>
          {Array.from({ length: MAX_WRONG }).map((_, i) => <div key={i} style={s.wrongDot(i < wrongGuesses.length)} />)}
        </div>
        <div style={s.wordRow}>
          {word.split('').map((l, i) => (
            <div key={i} style={s.letterBox(revealed[i])}>{revealed[i] !== '_' ? revealed[i] : ''}</div>
          ))}
        </div>
        {wrongGuesses.length > 0 && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>Wrong: {wrongGuesses.join(' ')}</div>}
        {!showHint && !gameOver && <button style={s.hintBtn} onClick={() => setShowHint(true)}>💡 Show Hint</button>}
        {showHint && <div style={s.hint}>💡 Hint: {hint}</div>}
        {gameOver && (
          <div style={s.resultBanner(won)}>
            {won ? '🎉 Brilliant! You got it!' : `💀 Game Over! The word was "${word}"`}
          </div>
        )}
        <div style={s.keyboard}>
          {ALPHABET.map(l => {
            const state = !guessed.has(l) ? 'none' : word.includes(l) ? 'correct' : 'wrong';
            return <button key={l} style={s.key(state)} onClick={() => guess(l)} disabled={state !== 'none' || gameOver}>{l}</button>;
          })}
        </div>
        <div style={{ marginBottom: 10, color: '#64748b', fontSize: 12 }}>💻 You can also type on your keyboard</div>
        <button style={s.newBtn} onClick={newGame}>🔄 New Word</button>
      </div>
    </div>
  );
}
