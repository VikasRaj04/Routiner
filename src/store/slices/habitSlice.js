import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHabits, addHabit, deleteHabit, updateHabit } from "../../firebase/firebaseService";

// Helper functions
const getLocalHabits = () => JSON.parse(localStorage.getItem("habits")) || [];
const saveLocalHabits = (habits) => localStorage.setItem("habits", JSON.stringify(habits));

const isFutureDate = (dateString) => {
  if (!dateString) return false;
  const today = new Date().setHours(0, 0, 0, 0);
  const inputDate = new Date(dateString).setHours(0, 0, 0, 0);
  return inputDate > today;
};

// Initial state
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

// Thunks for CRUD operations
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
  async ({ userID, habitID, updatedData, oldData }, { rejectWithValue }) => {
    try {
      if (userID.startsWith("guest_")) {
        let habits = getLocalHabits().map((habit) =>
          habit.id === habitID ? { ...habit, ...updatedData } : habit
        );
        saveLocalHabits(habits);
        return updatedData;
      } else {
        return await updateHabit(userID, habitID, updatedData, oldData);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
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
      .addCase(fetchUserHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserHabits.fulfilled, (state, action) => {
        state.loading = false;
        const allHabits = action.payload || [];
        state.habits = allHabits.filter((h) => !isFutureDate(h.startDate));
        state.futureHabits = allHabits.filter((h) => isFutureDate(h.startDate));
        state.totalHabits = action.payload;
      })
      .addCase(fetchUserHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch habits.";
      })
      .addCase(addNewHabit.fulfilled, (state, action) => {
        const newHabit = action.payload;
        const targetArray = isFutureDate(newHabit.startDate) ? state.futureHabits : state.habits;
        targetArray.push(newHabit);
      })
      .addCase(removeHabit.fulfilled, (state, action) => {
        const habitID = action.payload;
        state.habits = state.habits.filter((h) => h.id !== habitID);
        state.futureHabits = state.futureHabits.filter((h) => h.id !== habitID);
      })
      .addCase(modifyHabit.fulfilled, (state, action) => {
        const updated = action.payload;
        const habitID = action.meta.arg.habitID;

        state.habits = state.habits.filter((h) => h.id !== habitID);
        state.futureHabits = state.futureHabits.filter((h) => h.id !== habitID);

        const updatedHabit = { id: habitID, ...updated };
        const targetArray = isFutureDate(updatedHabit.startDate) ? state.futureHabits : state.habits;
        targetArray.push(updatedHabit);
      });
  },
});

export const { openEditModal, closeEditModal, setUserInfo } = habitSlice.actions;

export default habitSlice.reducer;
