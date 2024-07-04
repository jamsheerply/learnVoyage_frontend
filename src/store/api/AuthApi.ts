import axios, { AxiosInstance } from "axios";

interface UserData {
  [key: string]: string | number;
}
const baseURL = `${import.meta.env.VITE_BASE_URL}/users`;

export const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const registerUserApi = (userData: UserData) => {
  return api.post("/signup", userData);
};

export const loginUserApi = (userData: UserData) => {
  return api.post("/signin", userData);
};
export const resentOTpApi = (userData: UserData) => {
  return api.post("/resend-otp", userData);
};
export const verifyUserApi = (userData: UserData) => {
  return api.post("/verify-otp", userData);
};

export const isBlockedApi = (id: string) => {
  return api.get(`/isBlocked/${id}`);
};
export const logoutApi = () => {
  return api.get("/logout");
};
