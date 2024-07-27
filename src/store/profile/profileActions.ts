import { userProfileEntity } from "@/types/userProfileEntity";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileByIdApi, updateProfileApi } from "../api/AuthApi";
import { handleAxiosError } from "@/utils.ts/HandleAxiosError";

export const getProfileById = createAsyncThunk<
  userProfileEntity,
  string,
  {
    rejectValue: string;
  }
>("/auth/profile", async (userId, { rejectWithValue }) => {
  try {
    const respone = await getProfileByIdApi(userId);
    return respone.data.data as userProfileEntity;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const updateProfile = createAsyncThunk<
  userProfileEntity,
  userProfileEntity,
  {
    rejectValue: string;
  }
>("/auth/update-profile", async (userData, { rejectWithValue }) => {
  try {
    const response = await updateProfileApi(userData);
    return response.data.data as userProfileEntity;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});
