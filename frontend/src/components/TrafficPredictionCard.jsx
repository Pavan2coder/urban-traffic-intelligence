import React from 'react';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TrafficPredictionCard({ data, weather, hour }) {
  if (!data) {
    return (
      <div className="glass-panel">
        <div className="card-header">
          <h3 className="card-title">
            <Activity size={18} style={{ color: '#6366f1' }} />
            AI Traffic Congestion Analysis
          </h3>
        </div>
        <div className="card-body">
          <div className="placeholder-box">
            <div className="placeholder-icon">📊</div>
            <p style={{ fontWeight: 500 }}>No prediction data requested yet.</p>
            <p style={{ fontSize: '0.85rem' }}>Select your locations & time, then click <strong>Predict Traffic</strong> in the sidebar.</p>
          </div>
        </div>
      </div>
    );
  }

  const congestion = data.congestion_level || 50;
  const status = data.status || '🟢 Route Clear';
  const delay = data.estimated_time || 25;

  // Gauge colors
  let meterColor = '#10b981';
  let statusClass = 'clear';
  if (congestion > 75) {
    meterColor = '#ef4444';
    statusClass = 'jammed';
  } else if (congestion > 50) {
    meterColor = '#f59e0b';
    statusClass = 'heavy';
  }

  // Radial progress calculations (Radius = 65, circumference = 2 * PI * 65 = ~408)
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (congestion / 100) * circumference;

  // Generate 24-hour trend curve anchored to predicted congestion
  const baseTrend = [15, 10, 10, 15, 25, 40, 60, 85, 95, 80, 60, 55, 55, 60, 65, 75, 85, 95, 85, 65, 45, 35, 25, 20];
  const weatherPenalty = (weather === 'Rainy' || weather === 'Foggy') ? 15 : 0;
  
  const chartData = baseTrend.map((baseVal, h) => {
    const adjusted = Math.max(0, Math.min(100, baseVal + (congestion - 50) + weatherPenalty));
    return {
      hour: `${h}:00`,
      congestion: adjusted,
      isCurrent: h === hour
    };
  });

  return (
    <div className="glass-panel">
      <div className="card-header">
        <h3 className="card-title">
          <Activity size={18} style={{ color: '#6366f1' }} />
          AI Traffic Congestion Analysis
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          Real-time AI Model
        </span>
      </div>

      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.5rem', alignItems: 'center' }}>
          {/* Radial Meter */}
          <div className="gauge-container">
            <div className="radial-meter">
              <svg width="160" height="160">
                <circle
                  className="meter-bg"
                  cx="80"
                  cy="80"
                  r={radius}
                />
                <circle
                  className="meter-progress"
                  cx="80"
                  cy="80"
                  r={radius}
                  style={{
                    stroke: meterColor,
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset
                  }}
                />
              </svg>
              <div className="meter-content">
                <div className="meter-value" style={{ color: meterColor }}>{congestion}%</div>
                <div className="meter-label">Congestion</div>
              </div>
            </div>

            <div className={`status-pill ${statusClass}`}>
              {congestion > 60 ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
              <span>{status}</span>
            </div>
          </div>

          {/* Quick Metrics & Delay Note */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: congestion > 60 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: congestion > 60 ? '#ef4444' : '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Delay / Time</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {delay} mins {congestion > 60 ? 'traffic delay' : 'expected travel'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {congestion > 60 ? (
                <span style={{ color: '#f87171' }}>⚠️ High traffic volume detected on this junction! Consider choosing an alternate departure window or optimizing your route.</span>
              ) : (
                <span style={{ color: '#34d399' }}>✅ Smooth traffic conditions predicted. Ideal departure window with minimal delays.</span>
              )}
            </div>
          </div>
        </div>

        {/* 24-Hour Congestion Trend Chart */}
        <div style={{ marginTop: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={16} style={{ color: '#06b6d4' }} />
              24-Hour Traffic Trend Curve
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Peak Hour Highlights</span>
          </div>

          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={meterColor} stopOpacity={0.6}/>
                    <stop offset="95%" stopColor={meterColor} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`${value}%`, 'Congestion']}
                />
                <Area type="monotone" dataKey="congestion" stroke={meterColor} strokeWidth={2} fillOpacity={1} fill="url(#colorCongestion)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
