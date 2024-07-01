// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import instructorsReduce from "./Instructors/InstructorsSlice";
import categoryReduce from "./category/categorySlice";
import coursesReduce from "./course/coursesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    instructors: instructorsReduce,
    category: categoryReduce,
    courses: coursesReduce,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
