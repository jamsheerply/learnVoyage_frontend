import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CREATE_COURSE,
  GET_ALL_COURSES,
  READ_BY_ID_COURSE,
  UPDATE_COURSE,
} from "./types";
import {
  createCourseApi,
  getAllCourseApi,
  readByIdCourseApi,
  updatedCourseApi,
} from "../api/CourseApi";
import { handleAxiosError } from "../../utils.ts/HandleAxiosError";
import { PayloadActionProp } from "./coursesSlice";

export interface Course {
  mentorId?: string;
  courseName?: string;
  categoryId?: string;
  description?: string;
  language?: string;
  coursePrice?: number;
  courseThumbnailUrl?: string;
  courseDemoVideoUrl?: string;
  id?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  lessonId: number;
  title: string;
  description: string;
  videoUrl: string | null;
}

export interface CourseWithLesson {
  id: string;
  lessons: Lesson[];
}

export const getAllCoursesList = createAsyncThunk<
  PayloadActionProp,
  void,
  { rejectValue: string }
>(GET_ALL_COURSES, async (_, { rejectWithValue }) => {
  try {
    const response = await getAllCourseApi();
    console.log(JSON.stringify(response.data.data));
    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const createCourse = createAsyncThunk<
  Course,
  Course,
  { rejectValue: string }
>(CREATE_COURSE, async (courseData, { rejectWithValue }) => {
  try {
    const response = await createCourseApi(courseData);

    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const updateCourse = createAsyncThunk<
  Course,
  Course,
  { rejectValue: string }
>(UPDATE_COURSE, async (courseData, { rejectWithValue }) => {
  try {
    const response = await updatedCourseApi(courseData);
    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const readByIdCourse = createAsyncThunk<
  CourseWithLesson,
  string,
  { rejectValue: string }
>(READ_BY_ID_COURSE, async (id, { rejectWithValue }) => {
  try {
    const response = await readByIdCourseApi(id);
    // console.log(JSON.stringify(response.data.data));
    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});
