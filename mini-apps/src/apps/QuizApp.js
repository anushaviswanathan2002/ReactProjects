import React, { useState, useEffect, useCallback } from 'react';

const questions = [
  { q: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: 2 },
  { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
  { q: "What is 12 × 12?", options: ["132", "144", "124", "148"], answer: 1 },
  { q: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"], answer: 2 },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
  { q: "Which element has the symbol 'O'?", options: ["Gold", "Oxygen", "Osmium", "Oganesson"], answer: 1 },
  { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
  { q: "What is the speed of light (approx)?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"], answer: 0 },
  { q: "Who wrote 'Hamlet'?", options: ["Dickens", "Shakespeare", "Tolkien", "Austen"], answer: 1 },
  { q: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
];

const TIMER = 20;

export default function QuizApp() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timer, setTimer] = useState(TIMER);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);

  const goNext = useCallback(() => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setTimer(TIMER);
    }
  }, [current]);

  useEffect(() => {
    if (finished || answered) return;
    if (timer === 0) { handleSelect(-1); return; } // eslint-disable-line react-hooks/exhaustive-deps
    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, finished, answered]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[current].answer;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, { q: questions[current].q, selected: idx, correct: questions[current].answer, isCorrect: correct }]);
    setTimeout(goNext, 1200);
  };

  const restart = () => {
    setCurrent(0); setSelected(null); setScore(0);
    setFinished(false); setTimer(TIMER); setAnswered(false); setAnswers([]);
  };

  const s = {
    wrap: { minHeight: '100vh', background: 'linear-gradient(135deg,#1a0533,#0d1b4b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Segoe UI,sans-serif' },
    card: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: 40, maxWidth: 640, width: '100%', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    badge: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', borderRadius: 20, padding: '6px 16px', fontSize: 14, fontWeight: 700 },
    timer: (t) => ({ background: t <= 5 ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#10b981,#059669)', borderRadius: 20, padding: '6px 16px', fontSize: 14, fontWeight: 700, transition: 'all 0.3s' }),
    progress: { background: 'rgba(255,255,255,0.1)', borderRadius: 10, height: 8, marginBottom: 28, overflow: 'hidden' },
    progressBar: { height: '100%', background: 'linear-gradient(90deg,#7c3aed,#3b82f6)', borderRadius: 10, transition: 'width 0.4s ease' },
    question: { fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 28, lineHeight: 1.4 },
    optBtn: (idx, sel, ans, answered) => {
      let bg = 'rgba(255,255,255,0.07)';
      let border = '1px solid rgba(255,255,255,0.15)';
      let color = '#e2e8f0';
      if (answered) {
        if (idx === ans) { bg = 'rgba(16,185,129,0.3)'; border = '1px solid #10b981'; color = '#6ee7b7'; }
        else if (idx === sel) { bg = 'rgba(239,68,68,0.3)'; border = '1px solid #ef4444'; color = '#fca5a5'; }
      }
      return { background: bg, border, color, borderRadius: 14, padding: '14px 20px', width: '100%', textAlign: 'left', cursor: answered ? 'default' : 'pointer', fontSize: 16, fontWeight: 500, marginBottom: 12, transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: 12 };
    },
    label: (idx) => ({ background: 'rgba(124,58,237,0.4)', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }),
    resultWrap: { textAlign: 'center' },
    scoreCircle: { width: 140, height: 140, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(124,58,237,0.5)' },
    restartBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 36px', fontSize: 18, fontWeight: 700, cursor: 'pointer', marginTop: 24 },
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.resultWrap}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{pct >= 70 ? '🏆' : pct >= 40 ? '👍' : '💪'}</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 20 }}>Quiz Complete!</h2>
            <div style={s.scoreCircle}>
              <span style={{ fontSize: 36, fontWeight: 900 }}>{score}/{questions.length}</span>
              <span style={{ fontSize: 14, opacity: 0.8 }}>{pct}%</span>
            </div>
            <p style={{ color: '#a78bfa', fontSize: 18, marginBottom: 16 }}>{pct >= 70 ? 'Excellent work!' : pct >= 40 ? 'Good effort!' : 'Keep practicing!'}</p>
            <div style={{ textAlign: 'left', marginTop: 16 }}>
              {answers.map((a, i) => (
                <div key={i} style={{ background: a.isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${a.isCorrect ? '#10b981' : '#ef4444'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 8, fontSize: 13, color: '#e2e8f0' }}>
                  <span style={{ marginRight: 8 }}>{a.isCorrect ? '✅' : '❌'}</span>{a.q}
                </div>
              ))}
            </div>
            <button style={s.restartBtn} onClick={restart}>Play Again 🔄</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.header}>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>QUESTION</div>
            <span style={s.badge}>{current + 1} / {questions.length}</span>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4, textAlign: 'right' }}>TIME LEFT</div>
            <span style={s.timer(timer)}>⏱ {timer}s</span>
          </div>
        </div>
        <div style={s.progress}>
          <div style={{ ...s.progressBar, width: `${((current) / questions.length) * 100}%` }} />
        </div>
        <div style={{ fontSize: 13, color: '#a78bfa', marginBottom: 8 }}>Score: {score} pts</div>
        <p style={s.question}>{q.q}</p>
        {q.options.map((opt, idx) => (
          <button key={idx} style={s.optBtn(idx, selected, q.answer, answered)} onClick={() => handleSelect(idx)}>
            <span style={s.label(idx)}>{['A','B','C','D'][idx]}</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
