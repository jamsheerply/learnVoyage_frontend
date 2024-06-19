// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import instructorsReduce from "./Instructors/InstructorsSlice";
import categoryReduce from "./category/categorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    instructors: instructorsReduce,
    category: categoryReduce,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
