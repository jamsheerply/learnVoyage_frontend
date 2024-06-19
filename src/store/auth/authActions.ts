import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  isBlockedApi,
  loginUserApi,
  registerUserApi,
  resentOTpApi,
  verifyUserApi,
} from "../api/AuthApi";
import {
  IS_BLOCKED,
  LOGIN_USER,
  REGISTER_USER,
  RESEND_OTP,
  VERIFY_USER,
} from "./types";

interface UserData {
  [key: string]: string | number;
}

interface AsyncThunkConfig<T> {
  rejectValue: T;
}

export const registerUser = createAsyncThunk<
  string,
  UserData,
  AsyncThunkConfig<any>
>(REGISTER_USER, async (values, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(values);
    const token = response.data.data;
    localStorage.setItem("token", token);
    return token;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});

export const loginUser = createAsyncThunk<
  string,
  UserData,
  AsyncThunkConfig<any>
>(LOGIN_USER, async (values, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(values);
    const token = response.data.data;
    localStorage.setItem("token", token);
    return token;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});

export const resendOtp = createAsyncThunk<
  string,
  UserData,
  AsyncThunkConfig<any>
>(RESEND_OTP, async (values, { rejectWithValue }) => {
  try {
    const response = await resentOTpApi(values);
    const data = response.data.data;
    return data;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.respose.data);
  }
});

export const verifyOtp = createAsyncThunk<
  string,
  UserData,
  AsyncThunkConfig<any>
>(VERIFY_USER, async (values, { rejectWithValue }) => {
  try {
    const response = await verifyUserApi(values);
    const token = response.data.data;
    localStorage.setItem("token", token);
    return token;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});

export const isBlocked = createAsyncThunk<
  boolean,
  string,
  AsyncThunkConfig<any>
>(IS_BLOCKED, async (id, { rejectWithValue }) => {
  try {
    const response = await isBlockedApi(id);
    const isBlocked = response.data.data;
    console.log(isBlocked);
    return isBlocked;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});
