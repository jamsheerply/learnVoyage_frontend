import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi, registerUserApi, verifyUserApi } from "../api/AuthApi";
import { LOGIN_USER, REGISTER_USER, VERIFY_USER } from "./types";

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
