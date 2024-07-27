import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Course,
  CourseWithLesson,
  createCourse,
  getAllCoursesList,
  readByIdCourse,
} from "./coursesActions";

interface CourseState {
  total?: number;
  page?: number;
  limit?: number;
  courses: Course[];
  course: CourseWithLesson | null;
  loading: boolean;
  error: string | null;
}

export interface PayloadActionProp {
  total?: number;
  page?: number;
  limit?: number;
  courses: Course[];
}

const initialState: CourseState = {
  total: 0,
  page: 0,
  limit: 0,
  courses: [],
  course: null,
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoursesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllCoursesList.fulfilled,
        (state, action: PayloadAction<PayloadActionProp>) => {
          state.loading = false;
          state.courses = action.payload.courses;
          state.limit = action.payload.limit;
          state.page = action.payload.page;
          state.total = action.payload.total;
        }
      )
      .addCase(
        getAllCoursesList.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch courses";
        }
      )
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(
        createCourse.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to create course";
        }
      )
      .addCase(readByIdCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readByIdCourse.fulfilled,
        (state, action: PayloadAction<CourseWithLesson>) => {
          state.loading = false;
          state.course = action.payload;
        }
      )
      .addCase(
        readByIdCourse.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch course";
        }
      );
  },
});

export default coursesSlice.reducer;
