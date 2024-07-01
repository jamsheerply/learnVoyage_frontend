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
import { handleAxiosError } from "../../utils.ts/HandleAxiosError";

interface Category {
  id: string;
  categoryName: string;
  isBlocked: boolean;
  image: string;
}

export const readAllCategory = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>(READ_ALL_CATEGORY, async (_, { rejectWithValue }) => {
  try {
    const categoryData = await readAllCategoryApi();
    return categoryData.data.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const createCategory = createAsyncThunk<
  Category,
  Category,
  { rejectValue: string }
>(CREATE_CATEGORY, async (categoryData, { rejectWithValue }) => {
  try {
    const response = await createCategoryApi(categoryData);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  Category,
  { rejectValue: string }
>(UPDATE_CATEGORY, async (categoryData, { rejectWithValue }) => {
  try {
    const response = await updateCategoryApi(categoryData);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const readByIdCategory = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>(READ_BY_ID_CATEGORY, async (id, { rejectWithValue }) => {
  try {
    const response = await readByIdCategoryApi(id);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});
