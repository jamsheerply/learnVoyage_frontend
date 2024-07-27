// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import instructorsReduce from "./Instructors/InstructorsSlice";
import categoryReduce from "./category/categorySlice";
import coursesReduce from "./course/coursesSlice";
import chatsReduce from "./chat/chatsSlice";
import ProfileReduce from "./profile/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    instructors: instructorsReduce,
    category: categoryReduce,
    courses: coursesReduce,
    chats: chatsReduce,
    profile: ProfileReduce,
  },
});

export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
