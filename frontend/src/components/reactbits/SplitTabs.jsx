import React from 'react';
import { motion } from 'framer-motion';

export default function SplitTabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`split-tabs-container ${className}`}
      style={{
        display: 'inline-flex',
        gap: '0.3rem',
        background: 'rgba(7, 10, 18, 0.65)',
        padding: '0.3rem',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        ...style
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              fontSize: '0.82rem',
              fontFamily: "'Baloo 2', cursive, sans-serif",
              fontWeight: isActive ? 700 : 500,
              padding: '0.4rem 0.85rem',
              borderRadius: '9px',
              border: 'none',
              background: 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              outline: 'none',
              zIndex: 2,
              transition: 'color 0.2s ease'
            }}
          >
            {isActive && (
              <motion.div
                layoutId="splitTabActivePill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.35), rgba(6, 182, 212, 0.35))',
                  border: '1px solid rgba(99, 102, 241, 0.5)',
                  boxShadow: '0 0 12px rgba(99, 102, 241, 0.3)',
                  zIndex: -1
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            )}
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
