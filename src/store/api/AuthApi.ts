import axios, { AxiosInstance } from "axios";

interface UserData {
  [key: string]: string | number;
}

const baseURL = "http://localhost:3000/api";

export const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUserApi = (userData: UserData) => {
  return api.post("/users/signup", userData);
};

export const loginUserApi = (userData: UserData) => {
  return api.post("/users/signin", userData);
};

export const verifyUserApi = (userData: UserData) => {
  return api.post("/users/verify-otp", userData);
};
