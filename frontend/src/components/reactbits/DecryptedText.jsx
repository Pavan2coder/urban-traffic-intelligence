import React, { useEffect, useState } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]{}';

export default function DecryptedText({
  text = '',
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  className = '',
  style = {},
  animateOn = 'hover' // 'mount' | 'hover' | 'both'
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const decrypt = () => {
    if (isDecrypting) return;
    setIsDecrypting(true);

    let iteration = 0;
    const targetLength = text.length;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            const progress = iteration / maxIterations;

            if (sequential) {
              const charIndex = revealDirection === 'start' ? index : targetLength - 1 - index;
              if (iteration > (charIndex / targetLength) * maxIterations * 1.5) {
                return text[index];
              }
            } else if (progress >= 1) {
              return text[index];
            }

            const randPool = useOriginalCharsOnly ? text : CHARACTERS;
            return randPool[Math.floor(Math.random() * randPool.length)];
          })
          .join('');
      });

      iteration += 1;

      if (iteration > maxIterations * 1.8) {
        clearInterval(interval);
        setDisplayText(text);
        setIsDecrypting(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'mount' || animateOn === 'both') {
      decrypt();
    }
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (animateOn === 'hover' || animateOn === 'both') {
      decrypt();
    }
  };

  return (
    <span
      className={`decrypted-text ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-block',
        fontFamily: "'Baloo 2', cursive, sans-serif",
        cursor: 'pointer',
        transition: 'color 0.2s ease',
        ...style
      }}
    >
      {displayText}
    </span>
  );
}
