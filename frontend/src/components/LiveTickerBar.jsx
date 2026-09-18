import React from 'react';
import { ShieldAlert, Zap, Radio, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveTickerBar() {
  const alerts = [
    { icon: <Zap size={14} className="text-amber-400" />, text: "AI Model: RandomForest V2 Active (94.2% Congestion Accuracy)" },
    { icon: <Radio size={14} className="text-cyan-400" />, text: "Live Monitoring: 50 Key Hyderabad Intersections Connected" },
    { icon: <ShieldAlert size={14} className="text-emerald-400" />, text: "Peak Traffic Advisory: Begumpet & Hitech City Flyovers standard flow" },
    { icon: <Sparkles size={14} className="text-indigo-400" />, text: "Dynamic Dijkstra Routing Engine Loaded & Calibrated" }
  ];

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '0.45rem 1.5rem',
      fontSize: '0.8rem',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden',
      zIndex: 99
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#06b6d4',
          boxShadow: '0 0 8px #06b6d4',
          display: 'inline-block'
        }} />
        <span>LIVE INTELLIGENCE FEED</span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', margin: '0 2rem' }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap' }}
        >
          {[...alerts, ...alerts].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>
        HYDERABAD METRO TRAFFIC HUB
      </div>
    </div>
  );
}
