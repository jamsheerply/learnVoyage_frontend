// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { getAllInstructorsList, editInstructor } from "./InstructorsActions";

// interface Instructor {
//   profession: string;
//   profile: any;
//   firstName: string;
//   lastName: string;
//   email: string;
//   isBlocked: boolean;
//   id: string;
// }

// interface InstructorState {
//   instructors: Instructor[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: InstructorState = {
//   instructors: [],
//   loading: false,
//   error: null,
// };

// const instructorsSlice = createSlice({
//   name: "instructors",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllInstructorsList.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         getAllInstructorsList.fulfilled,
//         (state, action: PayloadAction<Instructor[]>) => {
//           state.loading = false;
//           state.instructors = action.payload;
//         }
//       )
//       .addCase(
//         getAllInstructorsList.rejected,
//         (state, action: PayloadAction<any>) => {
//           state.loading = false;
//           state.error = action.payload;
//         }
//       )
//       .addCase(editInstructor.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         editInstructor.fulfilled,
//         (state, action: PayloadAction<Instructor[]>) => {
//           state.loading = false;
//           state.instructors = action.payload;
//         }
//       )
//       .addCase(editInstructor.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default instructorsSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllInstructorsList, editInstructor } from "./InstructorsActions";

interface Instructor {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  id: string;
}

interface InstructorState {
  instructors: Instructor[];
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
      .addCase(
        getAllInstructorsList.fulfilled,
        (state, action: PayloadAction<Instructor[]>) => {
          state.loading = false;
          state.instructors = action.payload;
        }
      )
      .addCase(getAllInstructorsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editInstructor.fulfilled,
        (state, action: PayloadAction<Instructor[]>) => {
          state.loading = false;
          state.instructors = action.payload;
        }
      )
      .addCase(editInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default instructorsSlice.reducer;
