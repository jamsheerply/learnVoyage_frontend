import axios, { AxiosInstance } from "axios";

const baseURL = `${
  import.meta.env.VITE_BASE_URL
}/content-management/enrollment`;

const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const readByEnrollmentApi = (id: string) => {
  return api.get(`/read/${id}`);
};

export const readByEnrollmentCourseIdApi = (courseId: string) => {
  return api.get(`/readby/${courseId}`);
};
