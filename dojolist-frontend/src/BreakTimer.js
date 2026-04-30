import React, { useEffect, useState } from "react";
import CircularTimer from './CircularTimer'; // Ensure this is correct path
import "./TaskTimer.css";

function BreakTimer({
  breakTime,
  onEndBreak,
  handleExtendBreak,
  handleSkipBreak,
  breakExtended,
  isMuted,
  toggleMuteMusic,
}) {
  const totalTime = breakTime * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [progress, setProgress] = useState(100); // 100% to 0%

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onEndBreak();
          return 0;
        }
        const newTime = prev - 1;
        setProgress((newTime / totalTime) * 100);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onEndBreak, totalTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="zen-ui">
      <div className="fullscreen-overlay fullscreen-break">
        <div className="bubble-container">
          {Array.from({ length: 20 }).map((_, i) => {
            const colors = [
              "#A2D2FF",
              "#CDB4DB",
              "#FFC8DD",
              "#FFAFCC",
              "#BDE0FE",
              "#B5EAEA",
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 10 + Math.random() * 20;
            const left = Math.random() * 100;
            const duration = 8 + Math.random() * 4;

            return (
              <div
                key={i}
                className="bubble"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>

        <h2 className="break-message">You earned this break!</h2>

        <CircularTimer
  percentage={progress}
  timeString={formatTime(timeLeft)}
  isBreak={true}
  size={300}
/>


        {/* 🔘 BUTTONS */}
        <div className="break-buttons">
          {!breakExtended && (
            <button onClick={handleExtendBreak} className="extend-btn">
              Extend by 5 minutes
            </button>
          )}
          <button onClick={handleSkipBreak} className="skip-btn">
            Skip Break
          </button>
          <button onClick={toggleMuteMusic} className="mute-btn">
            {isMuted ? "Unmute" : "Mute Music"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BreakTimer;
