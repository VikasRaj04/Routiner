import { createSlice } from "@reduxjs/toolkit";

// Local Storage Helpers
const getItem = (key) => localStorage.getItem(key);
const setItem = (key, value) => localStorage.setItem(key, value);
const removeItem = (key) => localStorage.removeItem(key);

// Initial state: No user, no guest by default
const initialState = {
    user: null,
    userId: null,            // Not logged in
    isLoggedIn: false,
    loading: false,
};

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { uid, email, name, isGuest } = action.payload || {};

            if (uid && !isGuest) {
                // ✅ Firebase authenticated user
                state.user = { uid, email, name };
                state.userId = uid;
                state.isLoggedIn = true;

                setItem("userID", uid);
                removeItem("anonymousUID"); // Remove any guest leftovers
            } else if (isGuest) {
                // 🔥 Guest login triggered explicitly
                const guestUID = getItem("anonymousUID") || `guest_${Date.now()}`;
                setItem("anonymousUID", guestUID);

                state.user = null;
                state.userId = guestUID;
                state.isLoggedIn = false; // Optional: change to true if guest counts as logged in
            }
        },

        clearUser: (state) => {
            state.user = null;
            state.userId = null;
            state.isLoggedIn = false;

            removeItem("userID");
            removeItem("anonymousUID");
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

// 📌 Selectors
export const selectUser = (state) => state.auth.user;
export const selectUserId = (state) => state.auth.userId;
export const selectIsLoggedIn = (state) => !!state.auth.user; // Only true if Firebase user

export const { setUser, clearUser, setLoading } = AuthSlice.actions;
export default AuthSlice.reducer;
