import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

// ✅ Thunk: Fetch current history
export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const historyRef = collection(db, `users/${userId}/history`);
      const snapshot = await getDocs(historyRef);
      const historyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return historyData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Thunk: Add a new history entry (create, update, delete, complete)
export const addHistoryEntry = createAsyncThunk(
  "history/addHistoryEntry",
  async (
    { userId, action, habitId, habitName, changes = null },
    { rejectWithValue }
  ) => {
    try {
      const historyRef = collection(db, `users/${userId}/history`);
      const newDoc = await addDoc(historyRef, {
        timestamp: serverTimestamp(),
        action, // "created", "updated", "deleted", "completed"
        habitId,
        habitName,
        changes: changes || null,
      });

      return {
        id: newDoc.id,
        action,
        habitId,
        habitName,
        changes,
        timestamp: new Date(), // Placeholder until Firestore returns real timestamp
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Thunk: Clear all history
export const clearHistory = createAsyncThunk(
  "history/clearHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const historyRef = collection(db, `users/${userId}/history`);
      const snapshot = await getDocs(historyRef);
      const deletePromises = snapshot.docs.map((docItem) =>
        deleteDoc(doc(db, `users/${userId}/history/${docItem.id}`))
      );
      await Promise.all(deletePromises);
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Thunk: Fetch lifetime history (can be same as normal if needed)
export const fetchLifetimeHistory = createAsyncThunk(
  "history/fetchLifetimeHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, `users/${userId}/history`)
      );
      let historyData = [];

      querySnapshot.forEach((doc) => {
        historyData.push({ id: doc.id, ...doc.data() });
      });

      return historyData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🎯 Slice
const historySlice = createSlice({
  name: "history",
  initialState: {
    historyList: [],
    lifetimeHistory: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch current history
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.historyList = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Add new history entry
      .addCase(addHistoryEntry.fulfilled, (state, action) => {
        state.historyList.unshift(action.payload); // latest at top
      })

      // 🔹 Clear all history
      .addCase(clearHistory.fulfilled, (state) => {
        state.historyList = [];
      })

      // 🔹 Fetch lifetime history
      .addCase(fetchLifetimeHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLifetimeHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.lifetimeHistory = action.payload;
      })
      .addCase(fetchLifetimeHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default historySlice.reducer;
