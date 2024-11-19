import { userProfileEntity } from "@/types/userProfileEntity";
import axios, { AxiosInstance } from "axios";

interface UserData {
  [key: string]: string | number;
}
const baseURL = `https://jamsheerply.life/api/users/auth`;
console.log(import.meta.env.VITE_BASE_URL + "   import.meta");

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

export const getProfileByIdApi = (id: string) => {
  return api.get(`/profile/${id}`);
};

export const updateProfileApi = (userData: userProfileEntity) => {
  return api.patch("/update-profile", userData);
};

export const readTotalStudnetsAndInstructorsApi = () => {
  return api.get("/read/total-students-and-instructors");
};

export const readAllStudentApi = () => {
  return api.get("/readAllStudents");
};
