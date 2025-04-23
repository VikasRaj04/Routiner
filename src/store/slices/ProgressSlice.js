import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProgressData } from "../../firebase/firebaseService";
import { formatDailyGraphData, formatWeeklyGraphData } from "../../utils/progressService";

// 🔁 Utils
const daysBack = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("en-CA");
};

// 🔁 Thunk
export const fetchProgress = createAsyncThunk(
  "progress/fetchProgress",
  async (userId) => {
    const { progressData } = await fetchProgressData(userId);
    const dailyGraph = formatDailyGraphData(progressData);
    const weeklyGraph = formatWeeklyGraphData(progressData);

    const today = new Date().toLocaleDateString("en-CA");

    let todayCompletedHabits = 0;
    let totalTodayExpected = 0;
    let totalTodayDone = 0;
    let lifetimeTotalDone = 0;
    let lifetimeTotalExpected = 0;

    const total21DayRatios = [];
    const totalLifetimeRatios = [];
    const categoryMap = {};

    let longestStreak = 0, mostCompleted = 0, mostMissed = 0;
    let longestStreakHabit = null, bestHabit = null, missedHabit = null;

    for (const habitId of Object.keys(progressData)) {
      const habitData = progressData[habitId];
      const completion = habitData?.completion || {};
      const category = habitData.category || "Uncategorized";

      categoryMap[category] ??= [];
      categoryMap[category].push(habitId);

      const todayTicks = completion[today]?.ticks || [];
      const todayExpected = todayTicks.length;
      const todayTrue = todayTicks.filter(Boolean).length;

      totalTodayExpected += todayExpected;
      totalTodayDone += todayTrue;
      if (todayExpected > 0 && todayTrue === todayExpected) todayCompletedHabits++;

      // 21-day ratio
      let habit21Expected = 0, habit21True = 0;
      for (let i = 0; i < 21; i++) {
        const date = daysBack(i);
        const ticks = completion[date]?.ticks || [];
        habit21Expected += ticks.length;
        habit21True += ticks.filter(Boolean).length;
      }
      if (habit21Expected > 0) total21DayRatios.push(habit21True / habit21Expected);

      // Lifetime
      let habitLifeExpected = 0, habitLifeTrue = 0;
      let currentStreak = 0, maxStreak = 0;

      const sortedDates = Object.keys(completion).sort((a, b) => new Date(a) - new Date(b));
      for (const date of sortedDates) {
        const ticks = completion[date]?.ticks || [];
        const expected = ticks.length;
        const done = ticks.filter(Boolean).length;

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
        longestStreakHabit = { habitId, name: habitData.habitName || "Unnamed Habit", streak: maxStreak };
      }

      if (habitLifeTrue > mostCompleted) {
        mostCompleted = habitLifeTrue;
        bestHabit = { habitId, name: habitData.habitName || "Unnamed Habit", completedCount: habitLifeTrue };
      }

      const missedCount = habitLifeExpected - habitLifeTrue;
      if (missedCount > mostMissed) {
        mostMissed = missedCount;
        missedHabit = { habitId, name: habitData.habitName || "Unnamed Habit", missedCount };
      }

      if (habitLifeExpected > 0) totalLifetimeRatios.push(habitLifeTrue / habitLifeExpected);
      lifetimeTotalDone += habitLifeTrue;
      lifetimeTotalExpected += habitLifeExpected;
    }

    const percent = (num, den) => den ? Math.round((num / den) * 100) : 0;

    return {
      fullProgress: progressData,
      dailyGraph,
      weeklyGraph,
      todayCompletedHabits,
      dailyOverallCompletionRate: percent(totalTodayDone, totalTodayExpected),
      streaklyOverallCompletionRate: percent(
        total21DayRatios.reduce((a, b) => a + b, 0),
        total21DayRatios.length
      ),
      lifeTimeOverallCompletionRate: percent(
        totalLifetimeRatios.reduce((a, b) => a + b, 0),
        totalLifetimeRatios.length
      ),
      overallAverage: percent(lifetimeTotalDone, lifetimeTotalExpected),
      longestStreakHabit,
      bestHabit,
      missedHabit,
      categoryMap,
    };
  }
);

// 🔧 Slice
const initialState = {
  fullProgress: {},
  dailyGraph: [],
  weeklyGraph: [],
  overallAverage: 0,
  todayCompletedHabits: 0,
  dailyOverallCompletionRate: 0,
  streaklyOverallCompletionRate: 0,
  lifeTimeOverallCompletionRate: 0,
  longestStreakHabit: null, // 🆕 Added
  bestHabit: null, // 🆕 Added
  missedHabit: null, // 🆕 Added
  categoryMap: {}, // 🆕 Added
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
        // Store new values
        Object.assign(state, { ...action.payload, loading: false, error: null });
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

export const selectLongestStreakHabit = (state) => state.progress.longestStreakHabit; // 🆕 Added
export const selectBestHabit = (state) => state.progress.bestHabit; // 🆕 Added
export const selectMissedHabit = (state) => state.progress.missedHabit; // 🆕 Added

export const selectCategoryMap = (state) => state.progress.categoryMap; // 🆕 Added

export const selectProgressLoading = (state) => state.progress.loading;

export default progressSlice.reducer;
