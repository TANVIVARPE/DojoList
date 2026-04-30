import React from 'react';
import './CircularTimer.css';

const CircularTimer = ({ percentage, timeString, isBreak, size = 600 }) => {
  const stroke = 10;
  const radius = size / 2;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <div className={`circular-timer-container ${isBreak ? 'break-mode' : ''}`} style={{ width: size, height: size }}>
      <svg height={size} width={size} className="timer-svg" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f5c4" />
            <stop offset="100%" stopColor="#28c3fb" />
          </linearGradient>
        </defs>
        <circle
          className="timer-bg"
          stroke="#1a1a1a"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="timer-ring"
          stroke="url(#timer-gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="timer-text">{timeString}</div>
    </div>
  );
};

export default CircularTimer;
