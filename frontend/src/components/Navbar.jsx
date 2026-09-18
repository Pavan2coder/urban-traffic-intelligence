import React, { useEffect, useState } from 'react';
import { MapPin, Cpu, ShieldCheck, Activity, Globe, Sparkles } from 'lucide-react';
import DecryptedText from './reactbits/DecryptedText.jsx';
import AnimatedCounter from './AnimatedCounter.jsx';

export default function Navbar({ locationsCount = 50, backendUrl = 'http://127.0.0.1:8000' }) {
  const [serverOnline, setServerOnline] = useState(false);
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const checkServer = async () => {
      const start = performance.now();
      try {
        const res = await fetch(`${backendUrl}/health`);
        if (res.ok) {
          setServerOnline(true);
          setLatency(Math.round(performance.now() - start));
        } else {
          setServerOnline(false);
        }
      } catch (err) {
        setServerOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 8000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <span>🚦</span>
        </div>
        <div>
          <h1 className="brand-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DecryptedText
              text="URBAN TRAFFIC INTELLIGENCE"
              animateOn="both"
              speed={35}
              maxIterations={12}
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: "'Baloo 2', cursive, sans-serif"
              }}
            />
          </h1>
          <div className="brand-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={11} className="text-cyan-400" />
            <span>AI CONGESTION & OPTIMAL ROUTE ENGINE</span>
          </div>
        </div>
      </div>

      <div className="navbar-stats">
        <div className="stat-badge">
          <MapPin size={14} style={{ color: '#06b6d4' }} />
          <span>
            <strong><AnimatedCounter value={locationsCount} /></strong> Nodes Active
          </span>
        </div>

        <div className="stat-badge">
          <Cpu size={14} style={{ color: '#818cf8' }} />
          <span>AI Engine: <strong>RandomForest AI</strong></span>
        </div>

        <div className="stat-badge" style={{
          borderColor: serverOnline ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
          background: serverOnline ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'
        }}>
          <span className={`pulse-dot ${serverOnline ? '' : 'offline'}`} style={{
            backgroundColor: serverOnline ? '#10b981' : '#ef4444',
            boxShadow: serverOnline ? '0 0 10px #10b981' : '0 0 10px #ef4444'
          }}></span>
          <span style={{ color: serverOnline ? '#34d399' : '#f87171', fontWeight: 600 }}>
            {serverOnline ? `API Live (${latency}ms)` : 'Connecting to API...'}
          </span>
        </div>
      </div>
    </nav>
  );
}
