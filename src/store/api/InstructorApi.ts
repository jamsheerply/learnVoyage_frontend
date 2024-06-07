import axios, { AxiosInstance } from "axios";

interface UserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isBlocked?: boolean;
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

export const getAllInstructorsApi = () => {
  return api.get("/users/instructors");
};

export const editInstructorApi = (userData: UserData) => {
  return api.patch("/users/instructor/edit", userData);
};
