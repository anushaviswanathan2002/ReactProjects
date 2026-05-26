import React, { useState } from 'react';
import QuizApp from './apps/QuizApp';
import CounterApp from './apps/CounterApp';
import TodoApp from './apps/TodoApp';
import DrawingApp from './apps/DrawingApp';
import RecipeApp from './apps/RecipeApp';
import TicTacToe from './apps/TicTacToe';
import MemoryGame from './apps/MemoryGame';
import HangmanGame from './apps/HangmanGame';
import WeatherApp from './apps/WeatherApp';
import QRCodeApp from './apps/QRCodeApp';

const APPS = [
  { id: 'quiz',     label: 'Quiz App',        icon: '🧠', color: '#7c3aed', desc: '10 questions, timed quiz with score tracking',  component: QuizApp },
  { id: 'counter',  label: 'Counter App',      icon: '🔢', color: '#3b82f6', desc: 'Multi-counter with history & custom settings',   component: CounterApp },
  { id: 'todo',     label: 'To-Do App',        icon: '✅', color: '#10b981', desc: 'Task manager with priorities & due dates',        component: TodoApp },
  { id: 'drawing',  label: 'Drawing App',      icon: '🎨', color: '#f59e0b', desc: 'Canvas drawing with shapes & tools',              component: DrawingApp },
  { id: 'recipe',   label: 'Recipe App',       icon: '👨‍🍳', color: '#ef4444', desc: '12 recipes with serving adjuster & search',    component: RecipeApp },
  { id: 'tictactoe',label: 'Tic Tac Toe',      icon: '⭕', color: '#ec4899', desc: '2-player or vs unbeatable AI',                  component: TicTacToe },
  { id: 'memory',   label: 'Memory Game',      icon: '🧩', color: '#8b5cf6', desc: 'Emoji card matching with timer & best score',   component: MemoryGame },
  { id: 'hangman',  label: 'Hangman Game',     icon: '🪢', color: '#06b6d4', desc: '15 words, SVG gallows, keyboard support',        component: HangmanGame },
  { id: 'weather',  label: 'Weather App',      icon: '🌤', color: '#0ea5e9', desc: '8 cities with hourly & 7-day forecast',          component: WeatherApp },
  { id: 'qrcode',   label: 'QR Code Generator',icon: '📱', color: '#84cc16', desc: 'Generate, customize & download QR codes',       component: QRCodeApp },
];

export default function App() {
  const [active, setActive] = useState(null);

  const ActiveComp = active ? APPS.find(a => a.id === active)?.component : null;

  if (ActiveComp) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <nav style={{
          position: 'sticky', top: 0, zIndex: 999,
          background: 'rgba(15,12,41,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
        }}>
          <button
            onClick={() => setActive(null)}
            style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#e2e8f0', borderRadius: 10, padding: '7px 14px',
              cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            ← Dashboard
          </button>
          <span style={{ color: '#a78bfa', fontSize: 18, fontWeight: 700 }}>
            {APPS.find(a => a.id === active)?.icon} {APPS.find(a => a.id === active)?.label}
          </span>
        </nav>
        <div style={{ flex: 1 }}>
          <ActiveComp />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29 0%,#1a0533 40%,#0d1b4b 100%)', padding: '40px 20px', fontFamily: 'Segoe UI,sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🚀</div>
        <h1 style={{
          fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, marginBottom: 12,
          background: 'linear-gradient(135deg,#a78bfa,#60a5fa,#34d399)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Mini Apps Collection
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
          10 fully-featured React apps — click any card to launch
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          {['React', 'JavaScript', 'CSS-in-JS', 'Interactive', 'Responsive'].map(tag => (
            <span key={tag} style={{
              background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
              color: '#a78bfa', borderRadius: 20, padding: '4px 12px', fontSize: 13,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* App Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20, maxWidth: 1200, margin: '0 auto',
      }}>
        {APPS.map((app, index) => (
          <AppCard key={app.id} app={app} index={index} onClick={() => setActive(app.id)} />
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 60, color: '#4b5563', fontSize: 14 }}>
        <div style={{ marginBottom: 8, fontSize: 24 }}>✨</div>
        Built with React · All apps run locally in your browser
      </div>
    </div>
  );
}

function AppCard({ app, index, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg,${app.color}22,${app.color}11)`
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? app.color + '66' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 20, padding: 24, cursor: 'pointer',
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? `0 20px 40px ${app.color}33` : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 100, height: 100, borderRadius: '50%',
        background: app.color, opacity: hovered ? 0.12 : 0.05,
        transition: 'opacity 0.3s', pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        {/* Icon */}
        <div style={{
          width: 54, height: 54, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg,${app.color}33,${app.color}22)`,
          border: `1px solid ${app.color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, boxShadow: hovered ? `0 0 20px ${app.color}44` : 'none',
          transition: 'box-shadow 0.3s',
        }}>
          {app.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{app.label}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>App #{String(APPS.findIndex(a=>a.id===app.id)+1).padStart(2,'0')}</div>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: hovered ? app.color : 'rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, transition: 'all 0.2s', color: '#fff',
        }}>→</div>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 14 }}>
        {app.desc}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          background: `${app.color}22`, border: `1px solid ${app.color}44`,
          color: app.color, borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 700,
        }}>
          Launch App
        </span>
        <div style={{ display: 'flex', gap: 3 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? app.color : `${app.color}44` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
