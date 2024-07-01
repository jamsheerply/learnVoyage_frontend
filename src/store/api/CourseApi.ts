import axios, { AxiosInstance } from "axios";
import { Course } from "../course/coursesActions";

const baseURL = `${import.meta.env.VITE_BASE_URL}/content-management/course`;

export const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export const getAllCourseApi = () => {
  return api.get("/read");
};

export const createCourseApi = (courseData: Course) => {
  return api.post("/create", courseData);
};

export const updatedCourseApi = (courseData: Course) => {
  return api.patch("/update", courseData);
};

export const readByIdCourseApi = (id: string) => {
  return api.get(`/read/${id}`);
};
