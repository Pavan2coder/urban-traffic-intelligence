import React from 'react';
import { Navigation, MapPin, Clock, CloudSun, ArrowDownUp, Sparkles, Compass } from 'lucide-react';

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

  const formatHour = (h) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:00 ${period}`;
  };

  const getTimeTag = (h) => {
    if (h >= 8 && h <= 10) return { label: '🔥 Morning Rush', color: '#ef4444' };
    if (h >= 17 && h <= 20) return { label: '🔥 Evening Peak', color: '#f59e0b' };
    if (h >= 22 || h <= 5) return { label: '🌙 Night Hours', color: '#6366f1' };
    return { label: '☀️ Standard Traffic', color: '#10b981' };
  };

  const timeTag = getTimeTag(hour);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <Navigation size={22} style={{ color: '#6366f1' }} />
        <h2 style={{ fontSize: '1.2rem' }}>Navigation Controls</h2>
      </div>

      {/* Source Location */}
      <div className="form-group">
        <label className="form-label">
          <MapPin size={14} style={{ color: '#10b981' }} />
          Source Location
        </label>
        <select
          className="select-input"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Swap Button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className="swap-btn"
          onClick={handleSwap}
          title="Swap Source and Destination"
        >
          <ArrowDownUp size={16} />
        </button>
      </div>

      {/* Destination Location */}
      <div className="form-group">
        <label className="form-label">
          <MapPin size={14} style={{ color: '#ef4444' }} />
          Destination Location
        </label>
        <select
          className="select-input"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Time Slider */}
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <div className="slider-header">
          <label className="form-label">
            <Clock size={14} style={{ color: '#06b6d4' }} />
            Departure Time
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <span>00:00</span>
            <span style={{ color: timeTag.color, fontWeight: '600' }}>{timeTag.label}</span>
            <span>23:00</span>
          </div>
        </div>
      </div>

      {/* Weather Selector */}
      <div className="form-group">
        <label className="form-label">
          <CloudSun size={14} style={{ color: '#f59e0b' }} />
          Weather Condition
        </label>
        <div className="weather-group">
          {[
            { id: 'Clear', icon: '☀️', label: 'Clear' },
            { id: 'Rainy', icon: '🌧️', label: 'Rainy' },
            { id: 'Foggy', icon: '🌫️', label: 'Foggy' }
          ].map((w) => (
            <button
              key={w.id}
              className={`weather-btn ${weather === w.id ? 'active' : ''}`}
              onClick={() => setWeather(w.id)}
            >
              <span style={{ fontSize: '1.2rem' }}>{w.icon}</span>
              <span>{w.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Triggers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button className="btn-primary" onClick={onPredict} disabled={loadingPredict}>
          <Sparkles size={18} />
          {loadingPredict ? 'Analyzing Traffic...' : 'Predict Traffic'}
        </button>

        <button className="btn-secondary" onClick={onFindRoute} disabled={loadingRoute}>
          <Compass size={18} />
          {loadingRoute ? 'Routing Path...' : 'Find Best Route'}
        </button>
      </div>
    </div>
  );
}
