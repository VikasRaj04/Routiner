import React from "react";
import { useSelector } from "react-redux";

const StatsProgress = () => {
  const progress = useSelector(state => state.progress);
  const loading = useSelector(state => state.auth.loading);  // Assuming you have a global loading state

  // Ensure data is available before using
  const overall = progress?.lifeTimeOverallCompletionRate || 0;  // Default to 0 if not available
  const dailyCompletion = progress?.todayCompletedHabits || 0;  // Default to 0 if not available
  const streakly = progress?.streaklyOverallCompletionRate || 0;  // Default to 0 if not available

  // Add a check to see if progress data is still loading
  if (loading) {
    return <p>Loading stats...</p>;  // This can be a spinner or custom loading component
  }

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
