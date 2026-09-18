import React from 'react';

export default function ShinyText({ text, speed = 4, className = '', style = {} }) {
  return (
    <span
      className={`shiny-text ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: `shinyTextAnimation ${speed}s linear infinite`,
        display: 'inline-block',
        ...style
      }}
    >
      {text}
    </span>
  );
}
