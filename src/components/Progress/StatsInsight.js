import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StatsInsights = () => {
  const [mostConsistent, setMostConsistent] = useState("N/A");
  const [mostSkipped, setMostSkipped] = useState("N/A");
  const [productiveDay, setProductiveDay] = useState("N/A");
  const [skippedDay, setSkippedDay] = useState("N/A");

  const progressData = useSelector((state) => state.progress.fullProgress);

  useEffect(() => {
    if (!progressData) return;

    const habitCount = {};
    const habitSkipped = {};
    const dayCompletion = {};
    const daySkipped = {};

    const allDates = new Set();
    const allHabitIds = Object.keys(progressData);

    // Gather all unique dates
    allHabitIds.forEach((habitId) => {
      const completion = progressData[habitId]?.completion || {};
      Object.keys(completion).forEach((date) => allDates.add(date));
    });

    // Process each (habit × date)
    allHabitIds.forEach((habitId) => {
      const { completion } = progressData[habitId];
      const habitEntries = completion || {};

      allDates.forEach((date) => {
        const entry = habitEntries[date];
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return;

        const day = parsedDate.toLocaleDateString("en-US", {
          weekday: "long",
        });

        const isCompleted = entry?.completion >= 90;

        if (entry && isCompleted) {
          habitCount[habitId] = (habitCount[habitId] || 0) + 1;
          dayCompletion[day] = (dayCompletion[day] || 0) + 1;
        } else {
          habitSkipped[habitId] = (habitSkipped[habitId] || 0) + 1;
          daySkipped[day] = (daySkipped[day] || 0) + 1;
        }
      });
    });

    // Determine consistent and skipped habits
    const consistentHabitId = Object.entries(habitCount).sort(([, a], [, b]) => b - a)[0]?.[0];
    const skippedHabitId = Object.entries(habitSkipped).sort(([, a], [, b]) => b - a)[0]?.[0];

    const consistentHabit = progressData[consistentHabitId]?.habitName || "N/A";
    const skippedHabit = progressData[skippedHabitId]?.habitName || "N/A";

    // Day-wise ratio analysis
    const allDays = new Set([...Object.keys(dayCompletion), ...Object.keys(daySkipped)]);
    const dayRatios = {};

    allDays.forEach((day) => {
      const completed = dayCompletion[day] || 0;
      const skipped = daySkipped[day] || 0;
      const total = completed + skipped;
      dayRatios[day] = total > 0 ? completed / total : 0;
    });

    const sortedDayRatios = Object.entries(dayRatios).sort(([, a], [, b]) => b - a);
    const topDay = sortedDayRatios[0]?.[0] || "N/A";
    const skipDay = sortedDayRatios[sortedDayRatios.length - 1]?.[0] || "N/A";

    setMostConsistent(consistentHabit);
    setMostSkipped(skippedHabit);
    setProductiveDay(topDay);
    setSkippedDay(skipDay);
  }, [progressData]);

  return (
    <div className="insights-stats">
      <h2>🔍 Insights</h2>
      <div className="insight-cards grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="insight-card bg-indigo-100 p-4 rounded-xl shadow">
          <h4 className="font-semibold text-indigo-800">Most Consistent Habit</h4>
          <p className="text-lg">{mostConsistent}</p>
        </div>
        <div className="insight-card bg-rose-100 p-4 rounded-xl shadow">
          <h4 className="font-semibold text-rose-800">Most Skipped Habit</h4>
          <p className="text-lg">{mostSkipped}</p>
        </div>
        <div className="insight-card bg-green-100 p-4 rounded-xl shadow">
          <h4 className="font-semibold text-green-800">Most Productive Day</h4>
          <p className="text-lg">{productiveDay}</p>
        </div>
        <div className="insight-card bg-yellow-100 p-4 rounded-xl shadow">
          <h4 className="font-semibold text-yellow-800">Most Skipped Day</h4>
          <p className="text-lg">{skippedDay}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsInsights;
