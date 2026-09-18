import React from 'react';
import { Navigation, MapPin, Clock, CloudSun, ArrowDownUp, Sparkles, Compass, Zap } from 'lucide-react';
import TiltCard from './reactbits/TiltCard.jsx';
import DecryptedText from './reactbits/DecryptedText.jsx';

const LOCATIONS = [
  "Abids", "Alwal", "Amberpet", "Ameerpet", "Attapur", "Bachupally", 
  "Banjara Hills", "Begumpet", "Bolarum", "Bowenpally", "Chanda Nagar", 
  "Charminar", "Dilsukhnagar", "Gachibowli", "Gandimaissama", "Ghatkesar", 
  "Habsiguda", "Hafeezpet", "Hayathnagar", "Hitech City", "JNTU", 
  "Jubilee Hills", "Khairatabad", "Kompally", "Kondapur", "Koti", 
  "Kukatpally", "LB Nagar", "Lakdikapul", "Lingampally", "Madhapur", 
  "Malkajgiri", "Masab Tank", "Medchal", "Mehdipatnam", "Miyapur", 
  "Nacharam", "Nampally", "Nizampet", "Panjagutta", "Paradise", 
  "Pragathi Nagar", "Raidurg", "Ramanthapur", "Sainikpuri", 
  "Secunderabad Station", "Shamirpet", "Tarnaka", "Uppal X Roads", "Yapral"
];

const PRESETS = [
  { name: 'IT Corridor', from: 'Hitech City', to: 'Gachibowli' },
  { name: 'Central Hub', from: 'Secunderabad Station', to: 'Banjara Hills' },
  { name: 'North Express', from: 'Alwal', to: 'Koti' },
  { name: 'Metro Line', from: 'Begumpet', to: 'LB Nagar' }
];

export default function ControlPanel({
  source, setSource,
  destination, setDestination,
  hour, setHour,
  weather, setWeather,
  onPredict, onFindRoute,
  loadingPredict, loadingRoute
}) {
  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const applyPreset = (presetFrom, presetTo) => {
    setSource(presetFrom);
    setDestination(presetTo);
  };

  const formatHour = (h) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:00 ${period}`;
  };

  const getTimeTag = (h) => {
    if (h >= 8 && h <= 10) return { label: '🔥 Morning Rush', color: '#ef4444' };
    if (h >= 17 && h <= 20) return { label: '🌆 Evening Peak', color: '#f59e0b' };
    if (h >= 22 || h <= 5) return { label: '🌙 Night Hours', color: '#818cf8' };
    return { label: '☀️ Standard Flow', color: '#10b981' };
  };

  const timeTag = getTimeTag(hour);

  return (
    <TiltCard glowColor="rgba(99, 102, 241, 0.28)">
      <div style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '11px',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8'
            }}>
              <Navigation size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: '#fff' }}>
                <DecryptedText text="NAVIGATION CONSOLE" animateOn="hover" speed={30} />
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Select journey parameters</p>
            </div>
          </div>
          <span style={{
            fontSize: '0.7rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            color: '#06b6d4',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            fontWeight: 600
          }}>
            HUD V2.0
          </span>
        </div>

        {/* Preset Chips */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Zap size={12} style={{ color: '#f59e0b' }} /> PRESET ROUTES:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {PRESETS.map((p) => {
              const isSelected = source === p.from && destination === p.to;
              return (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p.from, p.to)}
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: "'Baloo 2', cursive, sans-serif",
                    padding: '0.32rem 0.65rem',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Source Location */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={14} style={{ color: '#10b981' }} />
            Source Node
          </label>
          <select
            className="select-input"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                📍 {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.2rem 0' }}>
          <button
            className="swap-btn"
            onClick={handleSwap}
            title="Swap Origin and Destination"
          >
            <ArrowDownUp size={16} />
          </button>
        </div>

        {/* Destination Location */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={14} style={{ color: '#ef4444' }} />
            Destination Node
          </label>
          <select
            className="select-input"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                🎯 {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Time Slider */}
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <div className="slider-header">
            <label className="form-label">
              <Clock size={14} style={{ color: '#06b6d4' }} />
              Departure Hour
            </label>
            <span className="time-display">{formatHour(hour)}</span>
          </div>
          
          <div className="time-slider-container">
            <input
              type="range"
              min="0"
              max="23"
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value))}
              className="range-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>00:00</span>
              <span style={{ color: timeTag.color, fontWeight: '700' }}>
                {timeTag.label}
              </span>
              <span style={{ color: 'var(--text-dim)' }}>23:00</span>
            </div>
          </div>
        </div>

        {/* Weather Selector */}
        <div className="form-group">
          <label className="form-label">
            <CloudSun size={14} style={{ color: '#f59e0b' }} />
            Environmental Condition
          </label>
          <div className="weather-group">
            {[
              { id: 'Clear', icon: '☀️', label: 'Clear Sky' },
              { id: 'Rainy', icon: '🌧️', label: 'Rainy' },
              { id: 'Foggy', icon: '🌫️', label: 'Foggy' }
            ].map((w) => (
              <button
                key={w.id}
                className={`weather-btn ${weather === w.id ? 'active' : ''}`}
                onClick={() => setWeather(w.id)}
              >
                <span style={{ fontSize: '1.25rem' }}>{w.icon}</span>
                <span>{w.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Triggers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.75rem' }}>
          <button className="btn-primary" onClick={onPredict} disabled={loadingPredict}>
            <Sparkles size={18} />
            {loadingPredict ? 'Predicting Congestion...' : 'Predict Traffic Congestion'}
          </button>

          <button className="btn-secondary" onClick={onFindRoute} disabled={loadingRoute}>
            <Compass size={18} />
            {loadingRoute ? 'Calculating Shortest Path...' : 'Calculate Optimal Route'}
          </button>
        </div>
      </div>
    </TiltCard>
  );
}
