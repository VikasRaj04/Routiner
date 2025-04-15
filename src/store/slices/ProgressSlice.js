import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProgressData } from "../../firebase/firebaseService";
import { formatDailyGraphData, formatWeeklyGraphData } from "../../utils/progressService";

// 🔁 Thunk to fetch all progress data
export const fetchProgress = createAsyncThunk(
  "progress/fetchProgress",
  async (userId) => {
    const { progressData } = await fetchProgressData(userId);

    const dailyGraph = formatDailyGraphData(progressData);
    const weeklyGraph = formatWeeklyGraphData(progressData);

    const habitIds = Object.keys(progressData);
    const categoryMap = {};
    const today = new Date().toLocaleDateString("en-CA");

    let todayCompletedHabits = 0;

    const total21DayRatios = [];
    const totalLifetimeRatios = [];

    const daysBack = (days) => {
      const d = new Date();
      d.setDate(d.getDate() - days);
      return d.toLocaleDateString("en-CA");
    };

    let longestStreak = 0;
    let longestStreakHabit = null;

    let mostCompleted = 0;
    let bestHabit = null;

    let mostMissed = 0;
    let missedHabit = null;

    // ✅ New Counters for Improved Accuracy
    let totalTodayExpected = 0;
    let totalTodayDone = 0;

    let lifetimeTotalDone = 0;
    let lifetimeTotalExpected = 0;

    habitIds.forEach((habitId) => {
      const habitData = progressData[habitId];
      const completion = habitData?.completion || {};

      // ✅ Daily Calculation
      const todayTicks = completion[today]?.ticks || [];
      const todayExpected = todayTicks.length;
      const todayTrue = todayTicks.filter((v) => v === true).length;

      const category = habitData.category || "Uncategorized";
      if (!categoryMap[category]) categoryMap[category] = [];
      categoryMap[category].push(habitId);


      totalTodayExpected += todayExpected;
      totalTodayDone += todayTrue;

      if (todayExpected > 0 && todayTrue === todayExpected) {
        todayCompletedHabits++;
      }

      // ✅ 21-Day Completion Ratio
      let habit21True = 0;
      let habit21Expected = 0;

      for (let i = 0; i < 21; i++) {
        const date = daysBack(i);
        const ticks = completion[date]?.ticks || [];
        habit21Expected += ticks.length;
        habit21True += ticks.filter((t) => t === true).length;
      }

      if (habit21Expected > 0) {
        total21DayRatios.push(habit21True / habit21Expected);
      }

      // ✅ Lifetime Completion + Streak
      let habitLifeTrue = 0;
      let habitLifeExpected = 0;

      let currentStreak = 0;
      let maxStreak = 0;
      const sortedDates = Object.keys(completion).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      for (let i = 0; i < sortedDates.length; i++) {
        const ticks = completion[sortedDates[i]]?.ticks || [];
        const expected = ticks.length;
        const done = ticks.filter((v) => v === true).length;

        habitLifeExpected += expected;
        habitLifeTrue += done;

        if (expected > 0 && done === expected) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      if (maxStreak > longestStreak) {
        longestStreak = maxStreak;
        longestStreakHabit = {
          habitId,
          name: habitData.habitName || "Unnamed Habit",
          streak: maxStreak,
        };
      }

      if (habitLifeTrue > mostCompleted) {
        mostCompleted = habitLifeTrue;
        bestHabit = {
          habitId,
          name: habitData.habitName || "Unnamed Habit",
          completedCount: habitLifeTrue,

        };
      }

      const missedCount = habitLifeExpected - habitLifeTrue;
      if (missedCount > mostMissed) {
        mostMissed = missedCount;
        missedHabit = {
          habitId,
          name: habitData.habitName || "Unnamed Habit",
          missedCount,
        };
      }

      if (habitLifeExpected > 0) {
        totalLifetimeRatios.push(habitLifeTrue / habitLifeExpected);
      }

      // 🧮 Add to lifetime total
      lifetimeTotalDone += habitLifeTrue;
      lifetimeTotalExpected += habitLifeExpected;
    });

    // ✅ NEW: Daily Overall Completion Rate (based on actual ticks)
    const dailyOverallCompletionRate = totalTodayExpected
      ? Math.round((totalTodayDone / totalTodayExpected) * 100)
      : 0;

    // ✅ 21-Day Streak Avg
    const streaklyOverallCompletionRate = total21DayRatios.length
      ? Math.round(
        (total21DayRatios.reduce((a, b) => a + b, 0) / total21DayRatios.length) * 100
      )
      : 0;

    // ✅ Lifetime Ratio Avg
    const lifeTimeOverallCompletionRate = totalLifetimeRatios.length
      ? Math.round(
        (totalLifetimeRatios.reduce((a, b) => a + b, 0) / totalLifetimeRatios.length) * 100
      )
      : 0;

    // ✅ NEW: True Overall Average (based on all ticks ever)
    const overallAverage = lifetimeTotalExpected
      ? Math.round((lifetimeTotalDone / lifetimeTotalExpected) * 100)
      : 0;

    return {
      fullProgress: progressData,
      dailyGraph,
      weeklyGraph,
      todayCompletedHabits,
      dailyOverallCompletionRate,
      streaklyOverallCompletionRate,
      lifeTimeOverallCompletionRate,
      overallAverage,
      longestStreakHabit,
      bestHabit,
      missedHabit,
      categoryMap,
    };
  }
);

const initialState = {
  fullProgress: {},
  dailyGraph: [],
  weeklyGraph: [],
  overallAverage: 0,
  todayCompletedHabits: 0,
  dailyOverallCompletionRate: 0,
  streaklyOverallCompletionRate: 0,
  lifeTimeOverallCompletionRate: 0,
  longestStreakHabit: null,
  bestHabit: null,
  missedHabit: null,
  categoryMap: {}, // ✅ NEW
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.fullProgress = action.payload.fullProgress;
        state.dailyGraph = action.payload.dailyGraph;
        state.weeklyGraph = action.payload.weeklyGraph;

        state.todayCompletedHabits = action.payload.todayCompletedHabits;
        state.dailyOverallCompletionRate = action.payload.dailyOverallCompletionRate;
        state.streaklyOverallCompletionRate = action.payload.streaklyOverallCompletionRate;
        state.lifeTimeOverallCompletionRate = action.payload.lifeTimeOverallCompletionRate;

        state.longestStreakHabit = action.payload.longestStreakHabit;
        state.bestHabit = action.payload.bestHabit;
        state.missedHabit = action.payload.missedHabit;

        state.overallAverage = action.payload.overallAverage;
        state.categoryMap = action.payload.categoryMap; // ✅ Add this line

      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// ✅ Selectors
export const selectProgressData = (state) => state.progress.fullProgress;
export const selectDailyGraphData = (state) => state.progress.dailyGraph;
export const selectWeeklyGraphData = (state) => state.progress.weeklyGraph;

export const selectOverallAverage = (state) => state.progress.overallAverage;
export const selectTodayCompletedHabits = (state) => state.progress.todayCompletedHabits;

export const selectDailyOverallRate = (state) => state.progress.dailyOverallCompletionRate;
export const selectStreaklyOverallRate = (state) => state.progress.streaklyOverallCompletionRate;
export const selectLifeTimeOverallRate = (state) => state.progress.lifeTimeOverallCompletionRate;

export const selectProgressLoading = (state) => state.progress.loading;

export default progressSlice.reducer;
