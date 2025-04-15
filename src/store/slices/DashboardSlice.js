// dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";
// import { saveHabitsToLocal, getHabitsFromLocal } from "../../utils/localStorage";

const initialState = {
    name: null,
    // habits: getHabitsFromLocal("habits") || [],
    editModalOpen: false,
    habitToEdit: null,
    totalHabits: 0,
    currentStreak: 0,
    completionRate: 0,
    bestHabit: "",
    missedHabit: "",
    currentPage: 1,  // ✅ Pagination ke liye current page state
    itemsPerPage: 6,
    selectedDate: new Date().toISOString().split('T')[0],
    completedTasks: 45,
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
            return { ...state, ...action.payload };
        },
        
        
        setCurrentPage: (state, action) => {  
            state.currentPage = action.payload;  // ✅ Pagination ke liye missing reducer add kiya
        }
    }
});

export const { 
    setUsername, setHabits,
    setSelectedDate, setDashboardData, setCurrentPage  
} = dashboardSlice.actions;
export const selectDashboard = (state) => state.dashboard;


export default dashboardSlice.reducer;
