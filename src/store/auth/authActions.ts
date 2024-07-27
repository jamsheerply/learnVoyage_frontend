import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  isBlockedApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resentOTpApi,
  verifyUserApi,
} from "../api/AuthApi";
import {
  IS_BLOCKED,
  LOGIN_USER,
  LOGOUT,
  REGISTER_USER,
  RESEND_OTP,
  VERIFY_USER,
} from "./types";
import { handleAxiosError } from "../../utils.ts/HandleAxiosError";

interface UserData {
  [key: string]: string | number;
}

export const registerUser = createAsyncThunk<
  string,
  UserData,
  { rejectValue: string }
>(REGISTER_USER, async (values, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(values);
    const token = response.data.data;
    localStorage.setItem("token", token);
    return token;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk<
  string,
  UserData,
  { rejectValue: string }
>(LOGIN_USER, async (values, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(values);
    const token = response.data.data;
    localStorage.setItem("token", token);
    return token;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const resendOtp = createAsyncThunk<
  string,
  UserData,
  { rejectValue: string }
>(RESEND_OTP, async (values, { rejectWithValue }) => {
  try {
    const response = await resentOTpApi(values);
    const data = response.data.data;
    return data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const verifyOtp = createAsyncThunk<
  string,
  UserData,
  { rejectValue: string }
>(VERIFY_USER, async (values, { rejectWithValue }) => {
  try {
    const response = await verifyUserApi(values);
    const token = response.data.data;
    localStorage.setItem("token", token);
    return token;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const isBlocked = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>(IS_BLOCKED, async (id, { rejectWithValue }) => {
  try {
    const response = await isBlockedApi(id);
    const isBlocked = response.data.data;
    console.log(isBlocked);
    return isBlocked;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  LOGOUT,
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      const logout = response.data.data;
      return logout;
    } catch (error: unknown) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);
