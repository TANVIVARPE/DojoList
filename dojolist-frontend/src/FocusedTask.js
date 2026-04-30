import React, { useState, useEffect } from "react";
import "./FocusedTask.css"; // Ensure you create this file for styling
import api from "./api";

function FocusedTask({ task, onTaskComplete }) {
  const [timeLeft, setTimeLeft] = useState(task.duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [hasPaused, setHasPaused] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      completeTask();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Convert seconds into MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start the task
  const handleStart = () => {
    setIsRunning(true);
  };

  // Pause button logic (only once if task > 20 mins)
  const handlePause = () => {
    if (!hasPaused && task.duration > 20) {
      setIsRunning(false);
      setHasPaused(true);
    }
  };

  // Complete task logic
  const completeTask = async () => {
    try {
      await api.put(`/todos/${task.id}/complete`);
      onTaskComplete(); // Notify parent component (MainLayout) to update UI
    } catch (error) {
      console.error("Error completing task:", error.response?.data || error.message);
    }
  };

  return (
    <div className="focused-task">
      <h2>{task.task}</h2>
      <p>Time Left: {formatTime(timeLeft)}</p>
      <div className="buttons">
        {!isRunning && <button onClick={handleStart}>Start</button>}
        {isRunning && !hasPaused && task.duration > 20 && <button onClick={handlePause}>Pause</button>}
      </div>
    </div>
  );
}

export default FocusedTask;
