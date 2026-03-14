import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as apiLogin, getStoredSession, logout as apiLogout } from "../../api/auth.js";

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiLogin(credentials);
      return response; // Should return { token, user }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to login");
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true, // Start true until hydrated
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Hydrate state from localStorage on init
    hydrateAuth: (state) => {
      const session = getStoredSession();
      if (session) {
        state.user = session.user;
        state.token = session.token;
        state.isAuthenticated = true;
      }
      state.loading = false;
    },
    logoutUser: (state) => {
      apiLogout(); // Clears localStorage
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { hydrateAuth, logoutUser, clearError } = authSlice.actions;

export default authSlice.reducer;
