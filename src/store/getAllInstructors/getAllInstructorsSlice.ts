import { createSlice } from "@reduxjs/toolkit";
import { getAllInstructorsList } from "./getAllInstructorsActions";

interface InstructorState {
  instructors: string[];
  loading: boolean;
  error: string | null;
}

const initialState: InstructorState = {
  instructors: [],
  loading: false,
  error: null,
};

const instructorsSlice = createSlice({
  name: "instructors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllInstructorsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInstructorsList.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = action.payload;
      })
      .addCase(getAllInstructorsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default instructorsSlice.reducer;
