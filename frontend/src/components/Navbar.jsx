import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, MapPin, Cpu } from 'lucide-react';

export default function Navbar({ locationsCount = 50, backendUrl = 'http://127.0.0.1:8000' }) {
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${backendUrl}/health`);
        if (res.ok) setServerOnline(true);
        else setServerOnline(false);
      } catch (err) {
        setServerOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">🚦</div>
        <div>
          <h1 className="brand-title">Urban Traffic Intelligence</h1>
          <div className="brand-subtitle">AI-Powered Route & Congestion Engine</div>
        </div>
      </div>

      <div className="navbar-stats">
        <div className="stat-badge">
          <MapPin size={14} className="text-cyan-400" />
          <span><strong>{locationsCount}</strong> Junctions Monitored</span>
        </div>

        <div className="stat-badge">
          <Cpu size={14} className="text-indigo-400" />
          <span>ML Brain: <strong>RandomForest AI</strong></span>
        </div>

        <div className="stat-badge">
          <span className={`pulse-dot ${serverOnline ? '' : 'bg-rose-500'}`} style={{ backgroundColor: serverOnline ? '#10b981' : '#ef4444' }}></span>
          <span>{serverOnline ? 'Backend Online' : 'Connecting to API...'}</span>
        </div>
      </div>
    </nav>
  );
}
