import { createAsyncThunk } from "@reduxjs/toolkit";
import { editInstructorApi, getAllInstructorsApi } from "../api/InstructorApi";
import { handleAxiosError } from "@/utils.ts/HandleAxiosError";

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

export const getAllInstructorsList = createAsyncThunk<
  Instructor[],
  void,
  { rejectValue: string }
>("admin / instructors", async (_, { rejectWithValue }) => {
  try {
    const response = await getAllInstructorsApi();
    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const editInstructor = createAsyncThunk<
  Instructor[],
  EditInstructorParams,
  { rejectValue: string }
>("admin/instructor/edit", async (values, { rejectWithValue }) => {
  try {
    const response = await editInstructorApi(values);
    console.log(JSON.stringify(response));
    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});
