import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readAllCategory, createCategory } from "./CategoryActions";

interface Category {
  id: string;
  categoryName: string;
  isBlocked: boolean;
  image: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(readAllCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readAllCategory.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(readAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create course";
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create course";
      });
  },
});

export default categorySlice.reducer;
