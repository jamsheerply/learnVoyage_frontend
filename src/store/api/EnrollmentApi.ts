import { EnrollmentEntity } from "@/types/enrollmentEntity";
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

export const updateEnrollmentApi = (
  enrollmentId: string,
  data: EnrollmentEntity
) => {
  return api.patch(`/update/${enrollmentId}`, data);
};

export const readCompletedCoursesApi = () => {
  return api.get("/read/completed-course");
};

export const readRecentEnrollmentApi = () => {
  return api.get("/read/recent-enrollment");
};

export const readTopCoursesApi = () => {
  return api.get("/read/top-courses");
};

export const readCoursesStatusApi = () => {
  return api.get("/read/courses-status");
};

export const totalEnrollmentsApi = () => {
  return api.get("/read/total-enrollment");
};

export const totalRevenueApi = () => {
  return api.get("/read/total-revenue");
};

export const topEnrollmentApi = () => {
  return api.get("/read/top-enrollment");
};
