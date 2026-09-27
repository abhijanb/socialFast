import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/core/store";
import type { Profile } from "../profile/api";

interface AuthState {
    user: Profile | null;
}

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Profile | null>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuthUser = (state: RootState): Profile | null => state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.user !== null;
