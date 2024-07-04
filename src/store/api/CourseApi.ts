import axios, { AxiosInstance } from "axios";
import { Course } from "../course/coursesActions";

export const baseURLCourse = `${
  import.meta.env.VITE_BASE_URL
}/content-management/course`;

export const api: AxiosInstance = axios.create({
  baseURL: baseURLCourse,
  withCredentials: true,
});

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
