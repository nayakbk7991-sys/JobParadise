
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null,
    isAuthenticated: false,
    authChecked: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = Boolean(action.payload);
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        setAuthChecked: (state, action) => {
            state.authChecked = action.payload;
        }
    }
});

export const {
    setLoading,
    setUser,
    clearUser,
    setAuthChecked
} = authSlice.actions;

export default authSlice.reducer;
