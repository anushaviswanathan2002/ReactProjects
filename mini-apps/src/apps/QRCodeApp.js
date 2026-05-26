import React, { useState, useRef } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const PRESETS = [
  { label: '🌐 URL', value: 'https://www.example.com', placeholder: 'Enter a website URL...' },
  { label: '📧 Email', value: 'mailto:hello@example.com', placeholder: 'mailto:you@example.com' },
  { label: '📱 Phone', value: 'tel:+1234567890', placeholder: 'tel:+1234567890' },
  { label: '💬 SMS', value: 'sms:+1234567890?body=Hello!', placeholder: 'sms:+1234567890?body=Message' },
  { label: '📶 WiFi', value: 'WIFI:T:WPA;S:MyNetwork;P:password123;;', placeholder: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
  { label: '📝 Text', value: 'Hello, World! This is a QR code.', placeholder: 'Enter any plain text...' },
];

const LEVELS = ['L','M','Q','H'];
const BG_THEMES = [
  { bg: '#ffffff', fg: '#000000', label: 'Classic' },
  { bg: '#1e1b4b', fg: '#a78bfa', label: 'Purple' },
  { bg: '#0f172a', fg: '#38bdf8', label: 'Blue' },
  { bg: '#064e3b', fg: '#6ee7b7', label: 'Green' },
  { bg: '#1c0a00', fg: '#f97316', label: 'Orange' },
  { bg: '#1a0011', fg: '#f472b6', label: 'Pink' },
];

export default function QRCodeApp() {
  const [text, setText] = useState('https://www.example.com');
  const [size, setSize] = useState(220);
  const [level, setLevel] = useState('M');
  const [theme, setTheme] = useState(BG_THEMES[0]);
  const [preset, setPreset] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [includeImage, setIncludeImage] = useState(false);
  const [history, setHistory] = useState([]);
  const qrRef = useRef(null);

  const handleGenerate = () => {
    if (!text.trim()) return;
    const entry = { text, size, level, theme, preset, time: new Date().toLocaleTimeString() };
    setHistory(h => [entry, ...h].slice(0, 6));
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyText = () => navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));

  const s = {
    wrap: { minHeight: '100vh', background: 'linear-gradient(135deg,#1a0533,#0d1b4b)', padding: '32px 20px', fontFamily: 'Segoe UI,sans-serif' },
    center: { maxWidth: 900, margin: '0 auto' },
    title: { textAlign: 'center', fontSize: 34, fontWeight: 800, color: '#fff', marginBottom: 8 },
    sub: { textAlign: 'center', color: '#94a3b8', marginBottom: 32, fontSize: 15 },
    layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' },
    panel: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24 },
    label: { color: '#94a3b8', fontSize: 13, marginBottom: 6, display: 'block', fontWeight: 600 },
    inp: { width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: 15, outline: 'none', marginBottom: 16, resize: 'vertical', minHeight: 80, fontFamily: 'inherit' },
    presetRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 },
    presetBtn: (active) => ({ background: active ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)', border: `1px solid ${active ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`, color: active ? '#a78bfa' : '#94a3b8', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }),
    section: { marginBottom: 18 },
    sectionTitle: { color: '#a78bfa', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
    themeRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
    themeBtn: (active, bg, fg) => ({ width: 44, height: 44, borderRadius: 10, background: bg, border: active ? `3px solid #fff` : `2px solid rgba(255,255,255,0.1)`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: fg, fontWeight: 700, overflow: 'hidden', transition: 'all 0.2s' }),
    levelRow: { display: 'flex', gap: 8 },
    levelBtn: (active) => ({ background: active ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'rgba(255,255,255,0.07)', color: active ? '#fff' : '#94a3b8', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }),
    slider: { width: '100%', accentColor: '#7c3aed', cursor: 'pointer', marginBottom: 4 },
    sliderLabel: { color: '#64748b', fontSize: 12, marginBottom: 12 },
    genBtn: { width: '100%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 17, fontWeight: 700, cursor: 'pointer', marginBottom: 10 },
    qrPanel: { textAlign: 'center' },
    qrWrap: { display: 'inline-block', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', marginBottom: 16, padding: 12, background: theme.bg, transition: 'all 0.3s' },
    btnRow: { display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 },
    dlBtn: { background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
    copyBtn: { background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 18px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
    histTitle: { color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, textAlign: 'left' },
    histItem: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 12px', marginBottom: 6, cursor: 'pointer', textAlign: 'left' },
    histText: { color: '#94a3b8', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 },
    histTime: { color: '#4b5563', fontSize: 10, marginTop: 2 },
    metaBox: { background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 14px', marginBottom: 12, border: '1px solid rgba(255,255,255,0.06)' },
    metaRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 },
    metaVal: { color: '#94a3b8', fontWeight: 600 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.center}>
        <div style={s.title}>📱 QR Code Generator</div>
        <p style={s.sub}>Generate beautiful QR codes instantly</p>
        <div style={s.layout}>
          <div>
            <div style={s.panel}>
              <div style={s.section}>
                <span style={s.sectionTitle}>Preset Types</span>
                <div style={s.presetRow}>
                  {PRESETS.map((p, i) => (
                    <button key={i} style={s.presetBtn(preset === i)} onClick={() => { setPreset(i); setText(p.value); }}>{p.label}</button>
                  ))}
                </div>
                <label style={s.label}>Content</label>
                <textarea style={s.inp} value={text} onChange={e => setText(e.target.value)} placeholder={PRESETS[preset].placeholder} rows={3} />
              </div>
              <div style={s.section}>
                <span style={s.sectionTitle}>Color Theme</span>
                <div style={s.themeRow}>
                  {BG_THEMES.map((t, i) => (
                    <button key={i} style={s.themeBtn(theme.bg === t.bg, t.bg, t.fg)} onClick={() => setTheme(t)} title={t.label}>
                      <span style={{ fontWeight: 900 }}>QR</span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={s.section}>
                <span style={s.sectionTitle}>Error Correction Level</span>
                <div style={s.levelRow}>
                  {LEVELS.map(l => (
                    <button key={l} style={s.levelBtn(level === l)} onClick={() => setLevel(l)}>{l}</button>
                  ))}
                </div>
                <div style={{ color: '#4b5563', fontSize: 11, marginTop: 6 }}>L=7% · M=15% · Q=25% · H=30% recovery</div>
              </div>
              <div style={s.section}>
                <span style={s.sectionTitle}>Size: {size}×{size}px</span>
                <input type="range" min={120} max={350} value={size} onChange={e => setSize(+e.target.value)} style={s.slider} />
              </div>
              <button style={s.genBtn} onClick={handleGenerate}>⚡ Generate & Save to History</button>
              {history.length > 0 && (
                <div>
                  <div style={s.histTitle}>Recent ({history.length})</div>
                  {history.map((h, i) => (
                    <div key={i} style={s.histItem} onClick={() => { setText(h.text); setSize(h.size); setLevel(h.level); setTheme(h.theme); }}>
                      <div style={s.histText}>{h.text}</div>
                      <div style={s.histTime}>{h.time} · {h.size}px · Level {h.level}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={s.panel}>
            <div style={s.qrPanel}>
              <div style={s.qrWrap} ref={qrRef}>
                {text.trim() ? (
                  <QRCode
                    value={text || ' '}
                    size={size}
                    level={level}
                    bgColor={theme.bg}
                    fgColor={theme.fg}
                    renderAs="canvas"
                  />
                ) : (
                  <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bg, color: theme.fg, fontSize: 14 }}>
                    Enter content
                  </div>
                )}
              </div>
              <div style={s.btnRow}>
                <button style={s.dlBtn} onClick={downloadQR}>⬇ Download PNG</button>
                <button style={s.copyBtn} onClick={copyText}>📋 Copy Text</button>
              </div>
              <div style={s.metaBox}>
                <div style={s.metaRow}><span>Size</span><span style={s.metaVal}>{size} × {size} px</span></div>
                <div style={s.metaRow}><span>Error Correction</span><span style={s.metaVal}>Level {level}</span></div>
                <div style={s.metaRow}><span>Characters</span><span style={s.metaVal}>{text.length}</span></div>
                <div style={s.metaRow}><span>Theme</span><span style={s.metaVal}>{BG_THEMES.find(t=>t.bg===theme.bg)?.label}</span></div>
              </div>
              <div style={{ color: '#64748b', fontSize: 11, lineHeight: 1.5 }}>
                📌 Scan with any QR code reader app.<br />Higher error correction = bigger QR but more reliable.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
