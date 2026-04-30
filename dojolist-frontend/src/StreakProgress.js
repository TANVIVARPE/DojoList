import React from "react";
import { motion } from "framer-motion";

const StreakProgress = ({ streak }) => {
  const maxStreak = 30; // Max streak milestone
  const progress = (streak / maxStreak) * 100;

  return (
    <div style={{ margin: "20px 0", textAlign: "center" }}>
      <h4>🔥 Streak: {streak} Days</h4>
      <div
        style={{
          width: "100%",
          height: "20px",
          background: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            background: "linear-gradient(to right, #ff6b6b, #fddb92)",
            borderRadius: "10px",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
        <span>5 Days 🎉</span>
        <span>10 Days 🚀</span>
        <span>30 Days 🏆</span>
      </div>
    </div>
  );
};

export default StreakProgress;
