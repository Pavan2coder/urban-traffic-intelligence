import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function TiltCard({
  children,
  className = '',
  style = {},
  tiltMaxAngle = 8,
  glowColor = 'rgba(99, 102, 241, 0.3)',
  onClick
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rY = ((mouseX - width / 2) / (width / 2)) * tiltMaxAngle;
    const rX = -((mouseY - height / 2) / (height / 2)) * tiltMaxAngle;

    setRotateX(rX);
    setRotateY(rY);
    setLightPos({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div style={{ perspective: 1000, width: '100%' }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.015 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20
        }}
        className={`tilt-card ${className}`}
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isHovered ? '1px solid var(--border-glow)' : '1px solid var(--glass-border)',
          boxShadow: isHovered
            ? `0 25px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px ${glowColor}`
            : '0 20px 30px -10px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          ...style
        }}
      >
        {/* Dynamic Light Beam Overlay */}
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            background: `radial-gradient(500px circle at ${lightPos.x}% ${lightPos.y}%, ${glowColor}, transparent 60%)`,
            zIndex: 1
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </motion.div>
    </div>
  );
}
