// src/redux/slices/BadgeSlice.js
import { createSlice } from "@reduxjs/toolkit";

// src/redux/slices/BadgeSlice.js (continue in same file)
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";


// 🧠 Fetch unlocked badges from Firestore
export const fetchUserBadges = createAsyncThunk(
  "badges/fetchUserBadges",
  async (uid, thunkAPI) => {
    try {
      const snapshot = await getDocs(collection(db, "users", uid, "achievements"));
      const badges = snapshot.docs.map((doc) => ({
        badgeId: doc.id,
        ...doc.data(),
      }));
      return badges;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const initialState = {
  badges: [],               // 🏅 All unlocked badges
  loading: false,           // ⏳ For async badge fetch/save
  error: null,              // ❌ For error handling
};

const badgeSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {
    setBadges: (state, action) => {
      state.badges = action.payload;
    },
    addBadge: (state, action) => {
      state.badges.unshift(action.payload); // 🆕 Add on top
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
  // Add this inside badgeSlice
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
        state.error = action.payload;
      });
  }

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
