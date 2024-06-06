import axios, { AxiosInstance } from "axios";

interface UserData {
  [key: string]: string | number;
}

const baseURL = "http://localhost:3000/api";

export const api: AxiosInstance = axios.create({
  baseURL: baseURL,
});

export const registerUserApi = (userData: UserData) => {
  return api.post("/users/signup", userData);
};

export const loginUserApi = (userData: UserData) => {
  return api.post("/users/signin", userData);
};

export const verifyUserApi = (userData: UserData) => {
  return api.post("/users/verify-otp", userData);
};

export const getAllInstructors = () => {
  return api.get("/users/instructors");
};
