import React, { useState, useEffect } from "react";
import "./TaskTimer.css";
import api from "./api";

function TaskTimer({ task, onExit }) {
  const totalTime = task.duration * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [hasPaused, setHasPaused] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      completeTask();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => setIsRunning(true);

  const handlePause = () => {
    if (!hasPaused && task.duration > 20) {
      setIsRunning(false);
      setHasPaused(true);
    }
  };

  const completeTask = async () => {
    try {
      await api.put(`/todos/${task.id}/complete`);
      onExit(); // ← Only call this after completion succeeds
    } catch (err) {
      console.error("Failed to mark task complete:", err);
    }
  };

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = ((totalTime - timeLeft) / totalTime) * circumference;

  return (
    <div className="task-timer-overlay">
      <div className="task-timer-content">
        <h2 className="task-title">{task.task}</h2>

        <div className="circular-timer-wrapper glow-pulse">
        <svg width="240" height="240">
  <defs>
    <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#00f5c4">
        <animate attributeName="stop-color" values="#00f5c4;#00c3ff;#00f5c4" dur="4s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stopColor="#00c3ff">
        <animate attributeName="stop-color" values="#00c3ff;#00f5c4;#00c3ff" dur="4s" repeatCount="indefinite" />
      </stop>
    </linearGradient>
  </defs>
  <circle
    className="progress-ring__circle-bg"
    stroke="#333"
    strokeWidth="10"
    fill="transparent"
    r={radius}
    cx="120"
    cy="120"
  />
  <circle
    className="progress-ring__circle"
    stroke="url(#animatedGradient)"
    strokeWidth="10"
    fill="transparent"
    r={radius}
    cx="120"
    cy="120"
    style={{
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: `${circumference - progress}`,
    }}
  />
</svg>

          <div className="timer-text">{formatTime(timeLeft)}</div>
        </div>

        <div className="controls">
          {!isRunning && (
            <button className="start-btn" onClick={handleStart}>
              Start
            </button>
          )}
          {isRunning && !hasPaused && task.duration > 20 && (
            <button className="pause-btn" onClick={handlePause}>
              Pause
            </button>
          )}
          {timeLeft === 0 && (
            <button className="exit-btn" onClick={onExit}>
              Exit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskTimer;
