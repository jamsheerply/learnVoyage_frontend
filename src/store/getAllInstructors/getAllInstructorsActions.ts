import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET_ALL_INSTRUCTORS } from "./types";
import { getAllInstructors as fetchAllInstructors } from "../api/api";

interface AsyncThunkConfig<T> {
  rejectValue: T;
}

export const getAllInstructorsList = createAsyncThunk<
  string[],
  void,
  AsyncThunkConfig<any>
>(GET_ALL_INSTRUCTORS, async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAllInstructors();
    // console.log(JSON.stringify(response.data.data));
    return response.data.data;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});
