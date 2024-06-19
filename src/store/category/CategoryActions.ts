import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  readAllCategoryApi,
  createCategoryApi,
  updateCategoryApi,
  readByIdCategoryApi,
} from "../api/CategoryApi";
import {
  CREATE_CATEGORY,
  READ_ALL_CATEGORY,
  READ_BY_ID_CATEGORY,
  UPDATE_CATEGORY,
} from "./types";

interface Category {
  id: string;
  categoryName: string;
  isBlocked: boolean;
  image: string;
}

interface AsyncThunkConfig<T> {
  rejectValue: T;
}

export const readAllCategory = createAsyncThunk<
  Category[],
  void,
  AsyncThunkConfig<any>
>(READ_ALL_CATEGORY, async (_, { rejectWithValue }) => {
  try {
    const categoryData = await readAllCategoryApi();
    return categoryData.data.data;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});

export const createCategory = createAsyncThunk<
  Category,
  Category,
  AsyncThunkConfig<any>
>(CREATE_CATEGORY, async (categoryData, { rejectWithValue }) => {
  try {
    const response = await createCategoryApi(categoryData);
    return response.data;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  Category,
  AsyncThunkConfig<any>
>(UPDATE_CATEGORY, async (categoryData, { rejectWithValue }) => {
  try {
    const response = await updateCategoryApi(categoryData);
    return response.data;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});

export const readByIdCategory = createAsyncThunk<
  Category,
  string,
  AsyncThunkConfig<any>
>(READ_BY_ID_CATEGORY, async (id, { rejectWithValue }) => {
  try {
    const response = await readByIdCategoryApi(id);
    return response.data;
  } catch (err: any) {
    console.log(err.response.data);
    return rejectWithValue(err.response.data);
  }
});
