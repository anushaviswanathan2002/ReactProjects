import React, { useRef, useState, useEffect, useCallback } from 'react';

const COLORS = ['#ffffff','#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#06b6d4','#000000','#6b7280','#f9fafb'];
const TOOLS = [
  { id: 'pen', label: '✏️', title: 'Pen' },
  { id: 'brush', label: '🖌️', title: 'Brush' },
  { id: 'eraser', label: '🧹', title: 'Eraser' },
  { id: 'line', label: '📏', title: 'Line' },
  { id: 'rect', label: '⬜', title: 'Rectangle' },
  { id: 'circle', label: '⭕', title: 'Circle' },
  { id: 'fill', label: '🪣', title: 'Fill' },
];

export default function DrawingApp() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#ffffff');
  const [size, setSize] = useState(4);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [opacity, setOpacity] = useState(1);

  const getCtx = () => canvasRef.current?.getContext('2d');
  const getOverlay = () => overlayRef.current?.getContext('2d');

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const data = canvas.toDataURL();
    setHistory(h => {
      const newH = h.slice(0, histIdx + 1);
      newH.push(data);
      return newH.slice(-30);
    });
    setHistIdx(i => Math.min(i + 1, 29));
  }, [histIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    overlay.width = overlay.offsetWidth;
    overlay.height = overlay.offsetHeight;
    const ctx = getCtx();
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory(); // eslint-disable-line react-hooks/exhaustive-deps
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return [r,g,b];
  };

  const floodFill = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const idx = (Math.round(y) * canvas.width + Math.round(x)) * 4;
    const targetColor = [data[idx], data[idx+1], data[idx+2], data[idx+3]];
    const [fr, fg, fb] = hexToRgb(color);
    const fa = Math.round(opacity * 255);
    if (targetColor[0] === fr && targetColor[1] === fg && targetColor[2] === fb) return;
    const stack = [[Math.round(x), Math.round(y)]];
    const match = (i) => data[i]===targetColor[0] && data[i+1]===targetColor[1] && data[i+2]===targetColor[2] && data[i+3]===targetColor[3];
    const paint = (i) => { data[i]=fr; data[i+1]=fg; data[i+2]=fb; data[i+3]=fa; };
    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx<0||cy<0||cx>=canvas.width||cy>=canvas.height) continue;
      const ci = (cy*canvas.width+cx)*4;
      if (!match(ci)) continue;
      paint(ci);
      stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }
    ctx.putImageData(imageData, 0, 0);
    saveHistory();
  };

  const startDraw = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    if (tool === 'fill') { floodFill(pos.x, pos.y); return; }
    setDrawing(true);
    setStartPos(pos);
    if (tool === 'pen' || tool === 'brush' || tool === 'eraser') {
      const ctx = getCtx();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const pos = getPos(e);
    const ctx = getCtx();
    const ov = getOverlay();

    if (tool === 'pen' || tool === 'brush' || tool === 'eraser') {
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = tool === 'brush' ? size * 3 : size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (tool === 'brush') { ctx.filter = 'blur(2px)'; } else { ctx.filter = 'none'; }
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      ov.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
      ov.globalAlpha = opacity;
      ov.strokeStyle = color;
      ov.fillStyle = color + '44';
      ov.lineWidth = size;
      ov.beginPath();
      if (tool === 'line') {
        ov.moveTo(startPos.x, startPos.y);
        ov.lineTo(pos.x, pos.y);
        ov.stroke();
      } else if (tool === 'rect') {
        ov.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
        ov.fillRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'circle') {
        const rx = Math.abs(pos.x - startPos.x) / 2;
        const ry = Math.abs(pos.y - startPos.y) / 2;
        const cx = startPos.x + (pos.x - startPos.x) / 2;
        const cy = startPos.y + (pos.y - startPos.y) / 2;
        ov.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ov.fill();
        ov.stroke();
      }
    }
  };

  const endDraw = (e) => {
    if (!drawing) return;
    const pos = e.changedTouches ? getPos({ clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY }) : getPos(e);
    const ctx = getCtx();
    const ov = getOverlay();
    if (tool === 'line' || tool === 'rect' || tool === 'circle') {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.fillStyle = color + '44';
      ctx.lineWidth = size;
      ctx.beginPath();
      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
        ctx.fillRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'circle') {
        const rx = Math.abs(pos.x - startPos.x) / 2;
        const ry = Math.abs(pos.y - startPos.y) / 2;
        const cx = startPos.x + (pos.x - startPos.x) / 2;
        const cy = startPos.y + (pos.y - startPos.y) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ov.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    setDrawing(false);
    saveHistory();
  };

  const undo = () => {
    if (histIdx <= 0) return;
    const newIdx = histIdx - 1;
    const img = new Image();
    img.src = history[newIdx];
    img.onload = () => { const ctx = getCtx(); ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height); ctx.drawImage(img,0,0); };
    setHistIdx(newIdx);
  };

  const redo = () => {
    if (histIdx >= history.length - 1) return;
    const newIdx = histIdx + 1;
    const img = new Image();
    img.src = history[newIdx];
    img.onload = () => { const ctx = getCtx(); ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height); ctx.drawImage(img,0,0); };
    setHistIdx(newIdx);
  };

  const clearCanvas = () => {
    const ctx = getCtx();
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveHistory();
  };

  const downloadCanvas = () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const s = {
    wrap: { minHeight: '100vh', background: '#0f0c29', display: 'flex', flexDirection: 'column', fontFamily: 'Segoe UI,sans-serif' },
    toolbar: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
    toolBtn: (active) => ({ background: active ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'rgba(255,255,255,0.07)', border: `1px solid ${active ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '8px 12px', cursor: 'pointer', fontSize: 18, title: 'tool', transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s' }),
    colorDot: (c, active) => ({ width: 28, height: 28, borderRadius: '50%', background: c, border: active ? '3px solid #fff' : '2px solid rgba(255,255,255,0.2)', cursor: 'pointer', transform: active ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.2s', flexShrink: 0 }),
    divider: { width: 1, height: 32, background: 'rgba(255,255,255,0.15)', margin: '0 4px' },
    iconBtn: (disabled) => ({ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: disabled ? '#64748b' : '#e2e8f0', borderRadius: 10, padding: '8px 12px', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }),
    canvasWrap: { flex: 1, position: 'relative', display: 'flex' },
    canvas: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
    sizeLabel: { color: '#94a3b8', fontSize: 13, minWidth: 60 },
    slider: { accentColor: '#7c3aed', cursor: 'pointer', width: 80 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.toolbar}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>🎨 Drawing</span>
        <div style={s.divider} />
        {TOOLS.map(t => (
          <button key={t.id} style={s.toolBtn(tool === t.id)} onClick={() => setTool(t.id)} title={t.title}>{t.label}</button>
        ))}
        <div style={s.divider} />
        {COLORS.map(c => (
          <div key={c} style={s.colorDot(c, color === c)} onClick={() => setColor(c)} />
        ))}
        <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none' }} title="Custom color" />
        <div style={s.divider} />
        <span style={s.sizeLabel}>Size: {size}px</span>
        <input type="range" min={1} max={40} value={size} onChange={e => setSize(+e.target.value)} style={s.slider} />
        <span style={s.sizeLabel}>Opacity: {Math.round(opacity*100)}%</span>
        <input type="range" min={0.1} max={1} step={0.05} value={opacity} onChange={e => setOpacity(+e.target.value)} style={s.slider} />
        <div style={s.divider} />
        <button style={s.iconBtn(histIdx <= 0)} onClick={undo}>↩ Undo</button>
        <button style={s.iconBtn(histIdx >= history.length-1)} onClick={redo}>↪ Redo</button>
        <button style={s.iconBtn(false)} onClick={clearCanvas}>🗑 Clear</button>
        <button style={{ ...s.iconBtn(false), background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', color: '#fff', border: 'none' }} onClick={downloadCanvas}>⬇ Save</button>
      </div>
      <div style={s.canvasWrap}>
        <canvas ref={canvasRef} style={{ ...s.canvas, zIndex: 1 }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        <canvas ref={overlayRef} style={{ ...s.canvas, zIndex: 2, pointerEvents: 'none' }} />
      </div>
    </div>
  );
}
