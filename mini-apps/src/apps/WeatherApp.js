import React, { useState } from 'react';

const WEATHER_DATA = {
  'london': { city: 'London', country: 'GB', temp: 14, feels: 11, humidity: 78, wind: 22, visibility: 8, pressure: 1013, condition: 'Cloudy', icon: '☁️', uv: 2, description: 'Overcast clouds with mild temperatures', hourly: [12,13,14,14,13,12,11,11,12,14,15,14], weekly: [{day:'Mon',icon:'🌧',hi:13,lo:9},{day:'Tue',icon:'☁️',hi:14,lo:10},{day:'Wed',icon:'⛅',hi:16,lo:11},{day:'Thu',icon:'🌤',hi:17,lo:12},{day:'Fri',icon:'☀️',hi:19,lo:13},{day:'Sat',icon:'⛅',hi:16,lo:11},{day:'Sun',icon:'🌧',hi:12,lo:8}] },
  'new york': { city: 'New York', country: 'US', temp: 22, feels: 20, humidity: 62, wind: 15, visibility: 16, pressure: 1021, condition: 'Partly Cloudy', icon: '⛅', uv: 5, description: 'Partly cloudy with pleasant conditions', hourly: [20,21,22,23,23,22,21,20,19,21,22,21], weekly: [{day:'Mon',icon:'⛅',hi:22,lo:16},{day:'Tue',icon:'☀️',hi:25,lo:18},{day:'Wed',icon:'☀️',hi:27,lo:19},{day:'Thu',icon:'🌤',hi:24,lo:17},{day:'Fri',icon:'🌧',hi:18,lo:14},{day:'Sat',icon:'⛅',hi:20,lo:15},{day:'Sun',icon:'☀️',hi:23,lo:16}] },
  'tokyo': { city: 'Tokyo', country: 'JP', temp: 28, feels: 31, humidity: 72, wind: 8, visibility: 12, pressure: 1008, condition: 'Humid & Warm', icon: '🌤', uv: 7, description: 'Warm and humid with partial sunshine', hourly: [25,26,28,29,30,29,28,27,26,27,28,27], weekly: [{day:'Mon',icon:'🌤',hi:28,lo:22},{day:'Tue',icon:'⛅',hi:27,lo:21},{day:'Wed',icon:'🌧',hi:24,lo:20},{day:'Thu',icon:'🌦',hi:25,lo:21},{day:'Fri',icon:'⛅',hi:26,lo:22},{day:'Sat',icon:'☀️',hi:29,lo:23},{day:'Sun',icon:'☀️',hi:30,lo:24}] },
  'sydney': { city: 'Sydney', country: 'AU', temp: 18, feels: 16, humidity: 65, wind: 18, visibility: 20, pressure: 1018, condition: 'Sunny', icon: '☀️', uv: 6, description: 'Beautiful sunny day with light breeze', hourly: [15,16,18,20,21,20,19,18,17,17,18,17], weekly: [{day:'Mon',icon:'☀️',hi:18,lo:12},{day:'Tue',icon:'☀️',hi:20,lo:13},{day:'Wed',icon:'⛅',hi:19,lo:12},{day:'Thu',icon:'🌧',hi:15,lo:11},{day:'Fri',icon:'🌦',hi:16,lo:11},{day:'Sat',icon:'⛅',hi:18,lo:12},{day:'Sun',icon:'☀️',hi:21,lo:14}] },
  'dubai': { city: 'Dubai', country: 'AE', temp: 38, feels: 42, humidity: 45, wind: 12, visibility: 18, pressure: 1005, condition: 'Hot & Sunny', icon: '☀️', uv: 10, description: 'Extremely hot and sunny, stay hydrated', hourly: [34,36,38,40,41,41,40,39,38,37,36,35], weekly: [{day:'Mon',icon:'☀️',hi:38,lo:28},{day:'Tue',icon:'☀️',hi:39,lo:29},{day:'Wed',icon:'☀️',hi:40,lo:30},{day:'Thu',icon:'☀️',hi:38,lo:28},{day:'Fri',icon:'🌤',hi:37,lo:27},{day:'Sat',icon:'☀️',hi:39,lo:29},{day:'Sun',icon:'☀️',hi:41,lo:31}] },
  'paris': { city: 'Paris', country: 'FR', temp: 20, feels: 18, humidity: 68, wind: 14, visibility: 15, pressure: 1015, condition: 'Pleasant', icon: '🌤', uv: 4, description: 'Lovely day in the City of Light', hourly: [18,19,20,21,22,21,20,19,18,19,20,19], weekly: [{day:'Mon',icon:'🌤',hi:20,lo:14},{day:'Tue',icon:'⛅',hi:19,lo:13},{day:'Wed',icon:'🌧',hi:16,lo:12},{day:'Thu',icon:'⛅',hi:18,lo:12},{day:'Fri',icon:'☀️',hi:22,lo:15},{day:'Sat',icon:'☀️',hi:23,lo:16},{day:'Sun',icon:'⛅',hi:20,lo:14}] },
  'moscow': { city: 'Moscow', country: 'RU', temp: -2, feels: -7, humidity: 82, wind: 20, visibility: 5, pressure: 1022, condition: 'Snowy', icon: '❄️', uv: 1, description: 'Cold and snowy with reduced visibility', hourly: [-3,-2,-1,-1,-1,-2,-3,-4,-4,-3,-2,-2], weekly: [{day:'Mon',icon:'❄️',hi:-2,lo:-8},{day:'Tue',icon:'🌨',hi:-1,lo:-7},{day:'Wed',icon:'⛅',hi:2,lo:-4},{day:'Thu',icon:'☁️',hi:1,lo:-5},{day:'Fri',icon:'❄️',hi:-3,lo:-9},{day:'Sat',icon:'❄️',hi:-4,lo:-10},{day:'Sun',icon:'🌨',hi:-1,lo:-7}] },
  'mumbai': { city: 'Mumbai', country: 'IN', temp: 32, feels: 36, humidity: 85, wind: 16, visibility: 7, pressure: 1002, condition: 'Humid', icon: '🌦', uv: 8, description: 'Hot and very humid with possible showers', hourly: [30,31,32,33,33,32,31,30,30,31,32,31], weekly: [{day:'Mon',icon:'🌦',hi:32,lo:26},{day:'Tue',icon:'🌧',hi:30,lo:25},{day:'Wed',icon:'⛈',hi:28,lo:24},{day:'Thu',icon:'🌦',hi:31,lo:25},{day:'Fri',icon:'🌤',hi:33,lo:27},{day:'Sat',icon:'⛅',hi:32,lo:26},{day:'Sun',icon:'🌧',hi:29,lo:24}] },
};

const SUGGESTIONS = ['London', 'New York', 'Tokyo', 'Sydney', 'Dubai', 'Paris', 'Moscow', 'Mumbai'];

const tempToColor = (t) => t >= 35 ? '#ef4444' : t >= 25 ? '#f97316' : t >= 15 ? '#10b981' : t >= 5 ? '#3b82f6' : '#818cf8';
const condToGrad = (cond) => {
  if (cond.toLowerCase().includes('snow') || cond.toLowerCase().includes('cold')) return 'linear-gradient(135deg,#1e3a5f,#4a6fa5)';
  if (cond.toLowerCase().includes('rain') || (cond.toLowerCase().includes('humid') && cond.toLowerCase().includes('shower'))) return 'linear-gradient(135deg,#1a2a4a,#2d4a7a)';
  if (cond.toLowerCase().includes('hot') || cond.toLowerCase().includes('sunny')) return 'linear-gradient(135deg,#7c2d12,#b45309)';
  if (cond.toLowerCase().includes('cloud')) return 'linear-gradient(135deg,#1e293b,#334155)';
  return 'linear-gradient(135deg,#1a3a5c,#1e4d8c)';
};

export default function WeatherApp() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');

  const convertTemp = (t) => unit === 'C' ? t : Math.round(t * 9 / 5 + 32);
  const unitLabel = unit === 'C' ? '°C' : '°F';

  const search = (city) => {
    setLoading(true); setError(''); setWeather(null);
    setTimeout(() => {
      const key = city.toLowerCase().trim();
      const data = WEATHER_DATA[key];
      if (data) { setWeather(data); }
      else { setError(`City "${city}" not found. Try: ${SUGGESTIONS.join(', ')}`); }
      setLoading(false);
    }, 800);
  };

  const handleSearch = () => { if (query.trim()) search(query); };

  const s = {
    wrap: { minHeight: '100vh', background: weather ? condToGrad(weather.condition) : 'linear-gradient(135deg,#0f0c29,#302b63)', padding: '32px 20px', fontFamily: 'Segoe UI,sans-serif', transition: 'background 0.6s ease' },
    center: { maxWidth: 720, margin: '0 auto' },
    title: { textAlign: 'center', fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 24, textShadow: '0 2px 10px rgba(0,0,0,0.4)' },
    searchRow: { display: 'flex', gap: 10, marginBottom: 16 },
    inp: { flex: 1, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 14, padding: '14px 18px', color: '#fff', fontSize: 16, outline: 'none' },
    searchBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 22px', fontSize: 20, cursor: 'pointer', backdropFilter: 'blur(10px)' },
    unitBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12, padding: '10px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 14 },
    suggestions: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
    suggBtn: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#e2e8f0', borderRadius: 20, padding: '5px 14px', cursor: 'pointer', fontSize: 13 },
    mainCard: { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: 32, marginBottom: 16, border: '1px solid rgba(255,255,255,0.15)' },
    cityName: { fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 4 },
    desc: { color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 20 },
    tempBig: (t) => ({ fontSize: 88, fontWeight: 900, color: tempToColor(t), lineHeight: 1, textShadow: `0 0 30px ${tempToColor(t)}66`, marginBottom: 4 }),
    condition: { fontSize: 20, color: '#fff', fontWeight: 600, marginBottom: 24 },
    detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 },
    detailBox: { background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 12 },
    detailIcon: { fontSize: 24 },
    detailVal: { fontSize: 18, fontWeight: 700, color: '#fff' },
    detailLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
    hourlyCard: { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', borderRadius: 18, padding: '16px 20px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.1)' },
    hourlyRow: { display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 },
    hourlyItem: { textAlign: 'center', minWidth: 52, background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '8px 6px' },
    weekCard: { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', borderRadius: 18, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.1)' },
    weekRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    sectionTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
    errBox: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 14, padding: '14px 18px', color: '#fca5a5', fontSize: 14, marginBottom: 16 },
    loadWrap: { textAlign: 'center', padding: 40, color: '#fff', fontSize: 40 },
    hours: ['Now','1h','2h','3h','4h','5h','6h','7h','8h','9h','10h','11h'],
  };

  return (
    <div style={s.wrap}>
      <div style={s.center}>
        <div style={s.title}>🌤 Weather App</div>
        <div style={s.searchRow}>
          <input style={s.inp} placeholder="Search city (e.g. Tokyo, Paris...)" value={query}
            onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <button style={s.searchBtn} onClick={handleSearch}>🔍</button>
          <button style={s.unitBtn} onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}>{unit === 'C' ? '°F' : '°C'}</button>
        </div>
        <div style={s.suggestions}>
          {SUGGESTIONS.map(c => <button key={c} style={s.suggBtn} onClick={() => { setQuery(c); search(c); }}>{c}</button>)}
        </div>
        {error && <div style={s.errBox}>⚠️ {error}</div>}
        {loading && <div style={s.loadWrap}>🌀</div>}
        {weather && !loading && (
          <>
            <div style={s.mainCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div>
                  <div style={s.cityName}>{weather.city} <span style={{ fontSize: 18, opacity: 0.7 }}>{weather.country}</span></div>
                  <div style={s.desc}>{weather.description}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div>
                      <span style={s.tempBig(weather.temp)}>{convertTemp(weather.temp)}{unitLabel}</span>
                      <div style={s.condition}>{weather.icon} {weather.condition}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Feels like {convertTemp(weather.feels)}{unitLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 24, ...s.detailGrid }}>
                <div style={s.detailBox}><span style={s.detailIcon}>💧</span><div><div style={s.detailVal}>{weather.humidity}%</div><div style={s.detailLabel}>Humidity</div></div></div>
                <div style={s.detailBox}><span style={s.detailIcon}>💨</span><div><div style={s.detailVal}>{weather.wind} km/h</div><div style={s.detailLabel}>Wind Speed</div></div></div>
                <div style={s.detailBox}><span style={s.detailIcon}>👁</span><div><div style={s.detailVal}>{weather.visibility} km</div><div style={s.detailLabel}>Visibility</div></div></div>
                <div style={s.detailBox}><span style={s.detailIcon}>🌡</span><div><div style={s.detailVal}>{weather.pressure} hPa</div><div style={s.detailLabel}>Pressure</div></div></div>
                <div style={s.detailBox}><span style={s.detailIcon}>☀️</span><div><div style={s.detailVal}>UV {weather.uv}</div><div style={s.detailLabel}>UV Index</div></div></div>
                <div style={s.detailBox}><span style={s.detailIcon}>🌡</span><div><div style={s.detailVal}>{convertTemp(weather.weekly[0].lo)}{unitLabel}</div><div style={s.detailLabel}>Tonight Low</div></div></div>
              </div>
            </div>
            <div style={s.hourlyCard}>
              <div style={s.sectionTitle}>⏱ Hourly Forecast</div>
              <div style={s.hourlyRow}>
                {weather.hourly.map((t, i) => (
                  <div key={i} style={s.hourlyItem}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{s.hours[i]}</div>
                    <div style={{ fontSize: 16, color: tempToColor(t), fontWeight: 700 }}>{convertTemp(t)}{unitLabel}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.weekCard}>
              <div style={s.sectionTitle}>📅 7-Day Forecast</div>
              {weather.weekly.map((d, i) => (
                <div key={i} style={{ ...s.weekRow, borderBottom: i === 6 ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#fff', fontWeight: 600, width: 48 }}>{d.day}</span>
                  <span style={{ fontSize: 22 }}>{d.icon}</span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ color: tempToColor(d.hi), fontWeight: 700 }}>{convertTemp(d.hi)}{unitLabel}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{convertTemp(d.lo)}{unitLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
