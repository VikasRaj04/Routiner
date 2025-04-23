import { createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  name: null,
  editModalOpen: false,
  habitToEdit: null,
  totalHabits: 0,
  currentStreak: 0,
  completionRate: 0,
  bestHabit: "",
  missedHabit: "",
  currentPage: 1,  // Pagination state
  itemsPerPage: 6,
  selectedDate: new Date().toISOString().split('T')[0], // Default today's date
  completedTasks: 0, // Initialize dynamically, if needed
  weeklyProgress: [],
  categories: [],
  dailyProgress: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.name = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setDashboardData: (state, action) => {
      // Avoid overwriting the entire state unnecessarily
      const { totalHabits, currentStreak, completionRate, bestHabit, missedHabit, weeklyProgress, dailyProgress } = action.payload;
      
      if (totalHabits !== undefined) state.totalHabits = totalHabits;
      if (currentStreak !== undefined) state.currentStreak = currentStreak;
      if (completionRate !== undefined) state.completionRate = completionRate;
      if (bestHabit !== undefined) state.bestHabit = bestHabit;
      if (missedHabit !== undefined) state.missedHabit = missedHabit;
      if (weeklyProgress) state.weeklyProgress = weeklyProgress;
      if (dailyProgress) state.dailyProgress = dailyProgress;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

// Exporting actions
export const { setUsername, setSelectedDate, setDashboardData, setCurrentPage } = dashboardSlice.actions;

// Selector
export const selectDashboard = (state) => state.dashboard;

export default dashboardSlice.reducer;
