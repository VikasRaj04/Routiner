// components/progress/StatsProgress.js
import React from "react";
import { useSelector } from "react-redux";


const StatsProgress = () => {
  const progress = useSelector(state => state.progress);
  const overall = progress.lifeTimeOverallCompletionRate;
  const dailyCompletion = progress.todayCompletedHabits;
  const streakly = progress.streaklyOverallCompletionRate;

  return (
    <div className="stats-progress">
      <div className="stat-card overall">
        <h3>Today Completed</h3>
        <p>{dailyCompletion}</p>
      </div>

      <div className="stat-card weekly">
        <h3>Streakly Completion</h3>
        <p>{streakly}%</p>
      </div>

      <div className="stat-card monthly">
        <h3>Overall Completion</h3>
        <p>{overall}%</p>
      </div>
    </div>
  );
};

export default StatsProgress;
