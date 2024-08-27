import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCourseApi,
  getAllCourseApi,
  readByIdCourseApi,
  updatedCourseApi,
} from "../api/CourseApi";
import { handleAxiosError } from "../../utils.ts/HandleAxiosError";
import { PayloadActionProp } from "./coursesSlice";
import { ICourse } from "@/types/course.entity";

export interface Lesson {
  lessonTitle: string;
  lessonId: number;
  // title: string;
  description: string;
  video: {
    publicId: string;
    version: string;
  };
}

export interface CourseWithLesson {
  id: string;
  lessons: Lesson[];
}

export const getAllCoursesList = createAsyncThunk<
  PayloadActionProp,
  void,
  { rejectValue: string }
>("instructor/courses", async (_, { rejectWithValue }) => {
  try {
    const response = await getAllCourseApi();
    // console.log(JSON.stringify(response.data.data));
    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const createCourse = createAsyncThunk<
  ICourse,
  ICourse,
  { rejectValue: string }
>("instructor/course/create", async (courseData, { rejectWithValue }) => {
  try {
    const response = await createCourseApi(courseData);

    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const updateCourse = createAsyncThunk<
  ICourse,
  ICourse,
  { rejectValue: string }
>("instructor/course/update", async (courseData, { rejectWithValue }) => {
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
>("instructor/course/read-by-id/:id", async (id, { rejectWithValue }) => {
  try {
    const response = await readByIdCourseApi(id);
    // console.log(JSON.stringify(response.data.data));
    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});
