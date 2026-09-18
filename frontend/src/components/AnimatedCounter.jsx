import React, { useEffect, useState } from 'react';

export default function AnimatedCounter({ value, duration = 1.2, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = 0;
    const targetValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (targetValue - startValue) * easeOutQuad);
      setDisplayValue(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span className="animated-counter-val">
      {prefix}{displayValue}{suffix}
    </span>
  );
}
