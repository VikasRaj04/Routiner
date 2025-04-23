// src/redux/slices/BadgeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

// 🎯 Async thunk: Fetch user's unlocked badges from Firestore
export const fetchUserBadges = createAsyncThunk(
  "badges/fetchUserBadges",
  async (uid, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(collection(db, "users", uid, "achievements"));
      return snapshot.docs.map((doc) => ({
        badgeId: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  badges: [],         // 🏅 All unlocked badges
  loading: false,     // ⏳ Async status
  error: null,        // ❌ Error state
};

const badgeSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {
    setBadges: (state, action) => {
      state.badges = action.payload;
    },
    addBadge: (state, action) => {
      state.badges.unshift(action.payload); // 🔝 Add to top
    },
    removeBadge: (state, action) => {
      state.badges = state.badges.filter(
        (badge) => badge.badgeId !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearBadges: (state) => {
      state.badges = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBadges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBadges.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = action.payload;
      })
      .addCase(fetchUserBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load badges";
      });
  },
});

export const {
  setBadges,
  addBadge,
  removeBadge,
  setLoading,
  setError,
  clearBadges,
} = badgeSlice.actions;

export default badgeSlice.reducer;
