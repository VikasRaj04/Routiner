import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchHabits,
  addHabit,
  deleteHabit,
  updateHabit,
  getUserInfo,
  addHistoryEntry,
} from "../../firebase/firebaseService";

const getLocalHabits = () => JSON.parse(localStorage.getItem("habits")) || [];
const saveLocalHabits = (habits) =>
  localStorage.setItem("habits", JSON.stringify(habits));

const initialState = {
  habits: [],
  futureHabits: [], 
  totalHabits: [],
  userInfo: null,
  loading: false,
  error: null,
  editModalOpen: false,
  habitToEdit: null,
};

const isFutureDate = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(dateString);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate > today;
};

export const fetchUserHabits = createAsyncThunk(
  "habits/fetchUserHabits",
  async (userID, { rejectWithValue }) => {
    try {
      if (userID.startsWith("guest_")) {
        return getLocalHabits();
      } else {
        return await fetchHabits(userID);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewHabit = createAsyncThunk(
  "habits/addNewHabit",
  async ({ userID, habitData }, { rejectWithValue }) => {
    try {
      if (userID.startsWith("guest_")) {
        let habits = getLocalHabits();
        const newHabit = { ...habitData, id: Date.now().toString() };
        habits.push(newHabit);
        saveLocalHabits(habits);
        return newHabit;
      } else {
        return await addHabit(userID, habitData);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeHabit = createAsyncThunk(
  "habits/removeHabit",
  async ({ userID, habitID, habitName }, { rejectWithValue }) => {
    try {
      if (userID.startsWith("guest_")) {
        let habits = getLocalHabits().filter((habit) => habit.id !== habitID);
        saveLocalHabits(habits);
        return habitID;
      } else {
        await deleteHabit(userID, habitID, habitName);
        return habitID;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const modifyHabit = createAsyncThunk(
  "habits/modifyHabit",
  async ({ userID, habitID, updatedData }, { rejectWithValue }) => {
    try {
      if (userID.startsWith("guest_")) {
        let habits = getLocalHabits().map((habit) =>
          habit.id === habitID ? { ...habit, ...updatedData } : habit
        );
        saveLocalHabits(habits);
        return updatedData;
      } else {
        return await updateHabit(userID, habitID, updatedData);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const habitSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    openEditModal: (state, action) => {
      state.editModalOpen = true;
      state.habitToEdit = action.payload;
    },
    closeEditModal: (state) => {
      state.editModalOpen = false;
      state.habitToEdit = null;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserHabits.fulfilled, (state, action) => {
        const allHabits = action.payload || [];
        state.habits = allHabits.filter(
          (h) => !isFutureDate(h.startDate)
        );
        state.futureHabits = allHabits.filter((h) =>
          isFutureDate(h.startDate)
        );
        state.totalHabits = action.payload;
      })
      .addCase(addNewHabit.fulfilled, (state, action) => {
        const newHabit = action.payload;
        if (!Array.isArray(state.habits)) state.habits = [];
        if (!Array.isArray(state.futureHabits)) state.futureHabits = [];

        if (isFutureDate(newHabit.startDate)) {
          state.futureHabits.push(newHabit);
        } else {
          state.habits.push(newHabit);
        }
      })
      .addCase(removeHabit.fulfilled, (state, action) => {
        const habitID = action.payload;
        state.habits = state.habits.filter((h) => h.id !== habitID);
        state.futureHabits = state.futureHabits.filter((h) => h.id !== habitID);
      })
      .addCase(modifyHabit.fulfilled, (state, action) => {
        const updated = action.payload;
        const habitID = action.meta.arg.habitID;

        // Remove from both lists
        state.habits = state.habits.filter((h) => h.id !== habitID);
        state.futureHabits = state.futureHabits.filter((h) => h.id !== habitID);

        // Reinsert to correct list
        const updatedHabit = { id: habitID, ...updated };
        if (isFutureDate(updatedHabit.startDate)) {
          state.futureHabits.push(updatedHabit);
        } else {
          state.habits.push(updatedHabit);
        }
      });
  },
});

export const { openEditModal, closeEditModal, setUserInfo } = habitSlice.actions;
export default habitSlice.reducer;
