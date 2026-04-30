
import React, { useEffect, useState, useContext } from "react";
import api from "./api";
import AuthContext from "./AuthContext";
import Navbar from "./Navbar";
import AddTodo from "./AddTodo";
import TaskTimer from "./TaskTimer";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import axios from "axios";
import "./MainLayout.css";
import "./CircularTimer.css";

function MainLayout() {
  const { user } = useContext(AuthContext);

  const [todos, setTodos] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [dailyGoal, setDailyGoal] = useState(3);
  const [completedToday, setCompletedToday] = useState(0);
  const [goalReached, setGoalReached] = useState(false);
  const [showGoalBanner, setShowGoalBanner] = useState(false);

  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);

  const [onBreak, setOnBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [breakProgress, setBreakProgress] = useState(100);
  const [addedExtraTime, setAddedExtraTime] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [audio] = useState(new Audio("/audio/relaxing_break_song.mp3"));
  const [isMuted, setIsMuted] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(300); // default 5 mins
  const totalBreakDuration = 300; // also used in strokeDashoffset calc


  const fetchTodos = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`http://localhost:8080/todos/user/${user.id}`);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err.message);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await api.post(`/todos/${taskId}/complete`);
      await fetchTodos();
      await fetchUserStreak();

      const today = new Date().toDateString();
      const saved = JSON.parse(localStorage.getItem("dailyGoal")) || {};
      const newCount = (saved.count || 0) + 1;

      setCompletedToday(newCount);
      localStorage.setItem("dailyGoal", JSON.stringify({ date: today, count: newCount }));

      if (newCount >= dailyGoal && !goalReached) {
        setGoalReached(true);
        setShowGoalBanner(true);
        setTimeout(() => setShowGoalBanner(false), 5000);
        showNotification("Goal Achieved!", `You completed ${dailyGoal} tasks today! 🎉`);
      }
    } catch (err) {
      console.error("Failed to complete task:", err.message);
    }
  };

  const fetchUserDailyGoal = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/users/${user.id}/dailyGoal`);
      const fetchedGoal = res.data.dailyGoal || 3;
      const completed = res.data.tasks_completed_today || 0;

      setDailyGoal(fetchedGoal);
      setCompletedToday(completed);

      localStorage.setItem("dailyGoal", JSON.stringify({
        date: new Date().toDateString(),
        count: completed,
        goal: fetchedGoal,
      }));

      if (completed >= fetchedGoal) {
        setGoalReached(true);
        setShowGoalBanner(true);
        setTimeout(() => setShowGoalBanner(false), 5000);
      }
    } catch (err) {
      console.error("Error fetching daily goal:", err.message);
    }
  };

  const loadDailyGoal = () => {
    const saved = JSON.parse(localStorage.getItem("dailyGoal"));
    const today = new Date().toDateString();
    if (saved?.date === today) {
      setCompletedToday(saved.count || 0);
      if (saved.count >= (saved.goal || dailyGoal)) {
        setGoalReached(true);
        setShowGoalBanner(true);
        setTimeout(() => setShowGoalBanner(false), 5000);
      }
    } else {
      resetDailyGoal();
    }
  };

  const resetDailyGoal = () => {
    setCompletedToday(0);
    setGoalReached(false);
    setShowGoalBanner(false);
    localStorage.setItem("dailyGoal", JSON.stringify({ date: new Date().toDateString(), count: 0 }));
  };

  useEffect(() => {
    if (user?.id) {
      fetchTodos();
      fetchUserStreak();
      fetchUserDailyGoal();
      loadDailyGoal();
    }

    const msUntilMidnight = new Date().setHours(24, 0, 0, 0) - Date.now();
    const timer = setTimeout(resetDailyGoal, msUntilMidnight);
    return () => clearTimeout(timer);
  }, [user?.id]);

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem("dailyGoal")) || {};
    localStorage.setItem("dailyGoal", JSON.stringify({ ...saved, date: today, count: completedToday }));
  }, [completedToday]);

  const fetchUserStreak = async () => {
    try {
      const res = await api.get(`/users/${user.id}/streak`);
      setStreak(res.data);
      updateProgress(res.data);
    } catch (err) {
      console.error("Failed to fetch streak:", err.message);
    }
  };

  const updateProgress = (s) => {
    if (s >= 30) setProgress(100);
    else if (s >= 10) setProgress((s / 30) * 100);
    else if (s >= 5) setProgress((s / 10) * 100);
    else setProgress((s / 5) * 100);
  };

  const startTimer = (todo) => setActiveTask(todo);
  const stopTimer = () => {
    clearInterval(intervalId);
    setActiveTask(null);
  };

  const startBreak = () => {
    const total = 300;
    setBreakTimeLeft(total);
    setBreakProgress(100);
    setOnBreak(true);
    setAddedExtraTime(false);

    if (!isMuted) {
      audio.loop = true;
      audio.volume = 0.4;
      audio.play().catch(err => console.error("Audio error:", err));
    }

    const interval = setInterval(() => {
      setBreakTimeLeft((prev) => {
        const updated = prev - 1;
        if (updated <= 0) {
          clearInterval(interval);
          setOnBreak(false);
          return 0;
        }
        setBreakProgress((updated / total) * 100);
        return updated;
      });
    }, 1000);

    setIntervalId(interval);
  };

  const addFiveMinutes = () => {
    if (!addedExtraTime) {
      setBreakTimeLeft(prev => prev + 300);
      setAddedExtraTime(true);
    }
  };

  const skipBreak = () => {
    clearInterval(intervalId);
    setOnBreak(false);
    setBreakTimeLeft(0);
    audio.pause();
    audio.currentTime = 0;
    setBreakProgress(100);
  };

  const toggleMuteMusic = () => {
    setIsMuted(prev => !prev);
    if (isMuted) audio.play();
    else audio.pause();
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/todos/${id}`);
      stopTimer();
      fetchTodos();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  const showNotification = (title, message) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/images/notif_icon.png"
      });
    }
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ---------------- Scheduled Task Notification ----------------
  const notifiedTasks = new Set();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      todos.forEach(task => {
        if (!task.completed && task.scheduledTime && !notifiedTasks.has(task.id)) {
          const scheduled = new Date(task.scheduledTime);
          const diff = scheduled - now;
          if (diff > 0 && diff <= 60000) {
            showNotification("Scheduled Task", `⏰ It's time for: ${task.task}`);
            notifiedTasks.add(task.id);
          }
        }
      });
    }, 30000); // check every 30 seconds

    return () => clearInterval(interval);
  }, [todos]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (onBreak && breakSeconds > 0) {
      const interval = setInterval(() => {
        setBreakSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (breakSeconds === 0) {
      setOnBreak(false);
      // Optionally trigger break complete logic here
    }
  }, [onBreak, breakSeconds]);

  return (
    <div className="main-layout">
      <Navbar streak={streak} completedToday={completedToday} dailyGoal={dailyGoal} />

      {showGoalBanner && (
        <>
          <Confetti numberOfPieces={200} recycle={false} />
          <motion.div className="goal-banner" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            🏆 <strong>Goal Achieved!</strong> You've completed {dailyGoal} tasks today! 🎉
          </motion.div>
        </>
      )}

      <div className="top-right">
        <AddTodo onTodoAdded={fetchTodos} />
      </div>

      <div className="tasks">
        <h3>All Todos</h3>
        <ul>
          {todos.map((todo) => (
            <motion.li key={todo.id} className={`task ${todo.completed ? "completed" : ""}`} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
              <strong>{todo.task}</strong> - {todo.priority.toUpperCase()} - {todo.duration} mins
              <div className="task-buttons">
                {!todo.completed && <button className="start-btn" onClick={() => startTimer(todo)}>▶️ Start</button>}
                <button  className="delete-btn" onClick={() => deleteTodo(todo.id)}>🗑️ Delete</button>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {activeTask && (
        <TaskTimer
          task={activeTask}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          stopTimer={stopTimer}
          onComplete={() => handleTaskComplete(activeTask.id)}
          onExit={async () => {
            await fetchTodos();
            await fetchUserDailyGoal();
            setActiveTask(null);
            setTimeout(startBreak, 100);
          }}
        />
      )}

{onBreak && (
  <div className="zen-ui">
    <div className="fullscreen-overlay fullscreen-break">
      <div className="bubble-container">
        {Array.from({ length: 20 }).map((_, i) => {
          const colors = ["#A2D2FF", "#CDB4DB", "#FFC8DD", "#FFAFCC", "#BDE0FE", "#B5EAEA"];
          const color = colors[i % colors.length];
          return <div className="bubble" key={i} style={{ backgroundColor: color }} />;
        })}
      </div>

      {/* ✅ Quote ABOVE the timer */}
      <div className="motivational-text">You've earned this break — breathe and relax.</div>

      {/* ✅ Timer Circle */}
      <div className="break-timer-wrapper">
      <div className="gradient-background" />
        <svg className="timer-svg" width="300" height="300" viewBox="0 0 400 400">
          <circle
            className="timer-ring"
            stroke="#00f5c4"
            strokeWidth="10"
            fill="transparent"
            r="180"
            cx="200"
            cy="200"
            strokeDasharray={2 * Math.PI * 180}
            strokeDashoffset={(2 * Math.PI * 180) * (1 - breakTimeLeft / totalBreakDuration)}
            transform="rotate(-90 200 200)" // ✅ Fix starting point to top (12 o'clock)
          />
        </svg>

        <div className="animated-gradient"></div>

        {/* ✅ TIMER centered inside the circle */}
        <div className="break-timer-text">
          {Math.floor(breakTimeLeft / 60).toString().padStart(2, "0")}:
          {(breakTimeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>

      {/* ✅ BUTTONS IN A ROW */}
      <div className="break-buttons horizontal-buttons">
        <button onClick={addFiveMinutes} disabled={addedExtraTime}>⏩ Extend 5 min</button>
        <button onClick={skipBreak}>⏭️ Skip</button>
        <button onClick={toggleMuteMusic}>{isMuted ? "🔇 Unmute" : "🔊 Mute"}</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default MainLayout;
