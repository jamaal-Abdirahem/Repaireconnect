import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Future slices (e.g., requests, technicians) can be added here
  },
});
