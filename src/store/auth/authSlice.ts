import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser, verifyOtp } from "./authActions";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthState {
  token: string | null;
  name: string;
  email: string;
  userId: string;
  role: string;
  isVerified: boolean;
  registerStatus: "pending" | "success" | "rejected" | "";
  registerError: any;
  loginStatus: "pending" | "success" | "rejected" | "";
  loginError: any;
  userLoaded: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  name: "",
  email: "",
  userId: "",
  isVerified: false,
  role: "",
  registerStatus: "",
  registerError: "",
  loginStatus: "",
  loginError: "",
  userLoaded: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUser(state) {
      const token = state.token;
      if (token) {
        const user: UserData = jwtDecode(token);
        console.log(JSON.stringify(user));
        state.token = token;
        state.name = user.name;
        state.email = user.email;
        state.userId = user.id;
        state.role = user.role;
        state.isVerified = user.isVerified;
        state.userLoaded = true;
      }
    },
    logoutUser(state) {
      localStorage.removeItem("token");
      state.token = null;
      state.name = "";
      state.email = "";
      state.userId = "";
      state.role = "";
      state.isVerified = false;
      state.registerStatus = "";
      state.registerError = "";
      state.loginStatus = "";
      state.loginError = "";
      state.userLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "pending";
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          if (action.payload) {
            const user: UserData = jwtDecode(action.payload);
            state.token = action.payload;
            state.name = user.name;
            state.email = user.email;
            state.userId = user.id;
            state.role = user.role;
            state.isVerified = user.isVerified;
            state.registerStatus = "success";
          }
        }
      )
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.registerStatus = "rejected";
        state.registerError = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "pending";
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        if (action.payload) {
          const user: UserData = jwtDecode(action.payload);

          state.token = action.payload;
          state.name = user.name;
          state.email = user.email;
          state.userId = user.id;
          state.role = user.role;
          state.isVerified = user.isVerified;
          state.loginStatus = "success";
        }
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loginStatus = "rejected";
        state.loginError = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loginStatus = "pending";
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<string>) => {
        if (action.payload) {
          const user: UserData = jwtDecode(action.payload);
          console.log(JSON.stringify(user));
          state.token = action.payload;
          state.name = user.name;
          state.email = user.email;
          state.userId = user.id;
          state.role = user.role;
          state.isVerified = user.isVerified;
          state.loginStatus = "success";
        }
      })
      .addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loginStatus = "rejected";
        state.loginError = action.payload;
      });
  },
});

export const { loadUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
