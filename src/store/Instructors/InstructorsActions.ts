import { createAsyncThunk } from "@reduxjs/toolkit";
import { EDIT_INSTRUCTOR, GET_ALL_INSTRUCTORS } from "./types";
import { editInstructorApi, getAllInstructorsApi } from "../api/InstructorApi";

interface Instructor {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  id: string;
}

interface EditInstructorParams {
  id: string;
  isBlocked: boolean;
}

interface AsyncThunkConfig<T> {
  rejectValue: T;
}

export const getAllInstructorsList = createAsyncThunk<
  Instructor[],
  void,
  AsyncThunkConfig<any>
>(GET_ALL_INSTRUCTORS, async (_, { rejectWithValue }) => {
  try {
    const response = await getAllInstructorsApi();
    return response.data.data;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});

export const editInstructor = createAsyncThunk<
  Instructor[],
  EditInstructorParams,
  AsyncThunkConfig<any>
>(EDIT_INSTRUCTOR, async (values, { rejectWithValue }) => {
  try {
    const response = await editInstructorApi(values);
    console.log(JSON.stringify(response));
    return response.data.data;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});
