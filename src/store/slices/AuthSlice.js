import { createSlice } from "@reduxjs/toolkit";

const getLocalStorageItem = (key) => localStorage.getItem(key);
const setLocalStorageItem = (key, value) => localStorage.setItem(key, value);
const removeLocalStorageItem = (key) => localStorage.removeItem(key);

const initialState = {
    user: null,
    userId: getLocalStorageItem("anonymousUID") || null, // 🔥 Pehle se saved UID fetch karo
    isLoggedIn: !!getLocalStorageItem("anonymousUID"), // 🔥 Guest user ho sakta hai
    loading: false,
};

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { uid, email, displayName } = action.payload || {};
            if (uid) {
                state.user = { uid, email, displayName };
                state.userId = uid;
                state.isLoggedIn = true;
                setLocalStorageItem("userID", uid); // ✅ Firebase user ko persist karo
            } else {
                let guestUID = getLocalStorageItem("anonymousUID") || `guest_${Date.now()}`;
                setLocalStorageItem("anonymousUID", guestUID);
                
                state.user = null;
                state.userId = guestUID;
                state.isLoggedIn = false;
            }
        },
        clearUser: (state) => {
            state.user = null;
            state.userId = null;
            state.isLoggedIn = false;
            removeLocalStorageItem("userID");
            removeLocalStorageItem("anonymousUID"); // 🔥 Guest user clear
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

// 📌 Selectors
export const selectUser = (state) => state.auth.user;
export const selectUserId = (state) => state.auth.userId;
export const selectIsLoggedIn = (state) => !!state.auth.userId; // ✅ Guest ya nahi check karne ke liye

export const { setUser, clearUser, setLoading } = AuthSlice.actions;
export default AuthSlice.reducer;
