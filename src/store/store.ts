// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import instructorsReduce from "./getAllInstructors/getAllInstructorsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    instructors: instructorsReduce,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
