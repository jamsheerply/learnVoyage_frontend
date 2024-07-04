import axios, { AxiosInstance } from "axios";

interface UserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isBlocked?: boolean;
}

const baseURL = `${import.meta.env.VITE_BASE_URL}/users`;

export const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const getAllInstructorsApi = () => {
  return api.get("/instructors");
};

export const editInstructorApi = (userData: UserData) => {
  return api.patch("/instructor/edit", userData);
};
