import { createSlice } from "@reduxjs/toolkit";

const userTypeSlice = createSlice({
    name: "userTypeSlice",
    initialState: {
        userType: "guest",
    },
    reducers: {
        setGuestUser: (state) => {
            state.userType = 'guest';
        },
        setLoggedInUser: (state) => {
            state.userType = 'loggedIn';
        },
    },
});

export const {setGuestUser, setLoggedInUser} = userTypeSlice.actions;

export default userTypeSlice.reducer;