import React, { useState, useEffect } from 'react';

const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkWinner(board) {
  for (let [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { winner: board[a], line: [a,b,c] };
  }
  if (board.every(Boolean)) return { winner: 'draw', line: [] };
  return null;
}

function minimax(board, isMax, depth = 0) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === 'O') return 10 - depth;
    if (result.winner === 'X') return depth - 10;
    return 0;
  }
  const scores = [];
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = isMax ? 'O' : 'X';
      scores.push(minimax(board, !isMax, depth + 1));
      board[i] = null;
    }
  }
  return isMax ? Math.max(...scores) : Math.min(...scores);
}

function getBestMove(board) {
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const score = minimax(board, false);
      board[i] = null;
      if (score > best) { best = score; move = i; }
    }
  }
  return move;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [mode, setMode] = useState('pvp'); // pvp or ai
  const [winLine, setWinLine] = useState([]);
  const [history, setHistory] = useState([]); // eslint-disable-line no-unused-vars

  useEffect(() => {
    if (mode === 'ai' && !isX && !result) {
      const timer = setTimeout(() => {
        const newBoard = [...board];
        const move = getBestMove(newBoard);
        if (move !== -1) {
          newBoard[move] = 'O';
          setBoard(newBoard);
          setHistory(h => [...h, move]);
          const r = checkWinner(newBoard);
          if (r) {
            setResult(r);
            setWinLine(r.line);
            setScores(s => ({ ...s, [r.winner === 'draw' ? 'draws' : r.winner]: s[r.winner === 'draw' ? 'draws' : r.winner] + 1 }));
          } else setIsX(true);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [board, isX, mode, result]);

  const handleClick = (idx) => {
    if (board[idx] || result) return;
    if (mode === 'ai' && !isX) return;
    const newBoard = [...board];
    newBoard[idx] = isX ? 'X' : 'O';
    setBoard(newBoard);
    setHistory(h => [...h, idx]);
    const r = checkWinner(newBoard);
    if (r) {
      setResult(r);
      setWinLine(r.line);
      setScores(s => ({ ...s, [r.winner === 'draw' ? 'draws' : r.winner]: s[r.winner === 'draw' ? 'draws' : r.winner] + 1 }));
    } else setIsX(!isX);
  };

  const resetGame = () => { setBoard(Array(9).fill(null)); setIsX(true); setResult(null); setWinLine([]); setHistory([]); };
  const resetAll = () => { resetGame(); setScores({ X: 0, O: 0, draws: 0 }); };

  const getCellStyle = (idx) => {
    const isWin = winLine.includes(idx);
    const val = board[idx];
    return {
      width: '100%', aspectRatio: '1', background: isWin ? (val === 'X' ? 'rgba(239,68,68,0.25)' : 'rgba(59,130,246,0.25)') : 'rgba(255,255,255,0.04)',
      border: `2px solid ${isWin ? (val === 'X' ? '#ef4444' : '#3b82f6') : 'rgba(255,255,255,0.12)'}`,
      borderRadius: 16, cursor: board[idx] || result ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 52, fontWeight: 900, color: val === 'X' ? '#ef4444' : '#3b82f6',
      transition: 'all 0.2s', boxShadow: isWin ? `0 0 24px ${val === 'X' ? '#ef444466' : '#3b82f666'}` : 'none',
      userSelect: 'none',
    };
  };

  const s = {
    wrap: { minHeight: '100vh', background: 'linear-gradient(135deg,#1a0533,#0d1b4b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Segoe UI,sans-serif' },
    card: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 36, maxWidth: 420, width: '100%', textAlign: 'center' },
    title: { fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 6 },
    modeRow: { display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 },
    modeBtn: (active) => ({ background: active ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'rgba(255,255,255,0.07)', color: active ? '#fff' : '#94a3b8', border: 'none', borderRadius: 10, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }),
    scoreRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 },
    scoreBox: (color) => ({ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 12, padding: '10px 8px' }),
    scoreVal: (color) => ({ fontSize: 28, fontWeight: 900, color: color }),
    scoreLabel: { fontSize: 11, color: '#94a3b8' },
    status: { marginBottom: 20, fontSize: 16, color: '#e2e8f0', minHeight: 28 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 },
    btnRow: { display: 'flex', gap: 10, justifyContent: 'center' },
    btn: (grad) => ({ background: grad, color: '#fff', border: 'none', borderRadius: 12, padding: '11px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }),
    resultBanner: { background: result?.winner === 'draw' ? 'rgba(245,158,11,0.2)' : result?.winner === 'X' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)', border: `1px solid ${result?.winner === 'draw' ? '#f59e0b' : result?.winner === 'X' ? '#ef4444' : '#3b82f6'}`, borderRadius: 12, padding: '12px 20px', marginBottom: 16, fontSize: 18, fontWeight: 700, color: '#fff' },
  };

  const statusText = result
    ? ''
    : mode === 'ai' && !isX
    ? '🤖 AI is thinking...'
    : `${isX ? '❌' : '⭕'} ${mode === 'ai' && isX ? 'Your turn' : `Player ${isX ? 'X' : 'O'}'s turn`}`;

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.title}>⭕ Tic Tac Toe</div>
        <div style={s.modeRow}>
          <button style={s.modeBtn(mode==='pvp')} onClick={() => { setMode('pvp'); resetAll(); }}>👥 2 Players</button>
          <button style={s.modeBtn(mode==='ai')} onClick={() => { setMode('ai'); resetAll(); }}>🤖 vs AI</button>
        </div>
        <div style={s.scoreRow}>
          <div style={s.scoreBox('#ef4444')}><div style={s.scoreVal('#ef4444')}>{scores.X}</div><div style={s.scoreLabel}>{mode==='ai' ? 'You (X)' : 'Player X'}</div></div>
          <div style={s.scoreBox('#f59e0b')}><div style={s.scoreVal('#f59e0b')}>{scores.draws}</div><div style={s.scoreLabel}>Draws</div></div>
          <div style={s.scoreBox('#3b82f6')}><div style={s.scoreVal('#3b82f6')}>{scores.O}</div><div style={s.scoreLabel}>{mode==='ai' ? 'AI (O)' : 'Player O'}</div></div>
        </div>
        {result && (
          <div style={s.resultBanner}>
            {result.winner === 'draw' ? '🤝 It\'s a Draw!' : result.winner === 'X' ? (mode==='ai' ? '🎉 You Win!' : '🎉 Player X Wins!') : (mode==='ai' ? '🤖 AI Wins!' : '🎉 Player O Wins!')}
          </div>
        )}
        {!result && <div style={s.status}>{statusText}</div>}
        <div style={s.grid}>
          {board.map((cell, idx) => (
            <div key={idx} style={getCellStyle(idx)} onClick={() => handleClick(idx)}>
              {cell === 'X' ? '✕' : cell === 'O' ? '○' : ''}
            </div>
          ))}
        </div>
        <div style={s.btnRow}>
          <button style={s.btn('linear-gradient(135deg,#7c3aed,#3b82f6)')} onClick={resetGame}>🔄 New Game</button>
          <button style={s.btn('rgba(255,255,255,0.1)')} onClick={resetAll}>↺ Reset Score</button>
        </div>
      </div>
    </div>
  );
}
