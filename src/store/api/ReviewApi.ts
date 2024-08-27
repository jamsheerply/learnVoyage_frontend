import { ReviewEntity } from "@/types/rateAndReviewEntity";
import axios, { AxiosInstance } from "axios";

const baseURL = `${
  import.meta.env.VITE_BASE_URL
}/content-management/rate-and-review`;

const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const createReviewApi = (reviewData: ReviewEntity) => {
  return api.post("/create", reviewData);
};

export const readReviewCouseIdApi = (courseId: string) => {
  return api.get(`/read/${courseId}`);
};

export const readRateAndReviewCourseIdApi = (courseId: string) => {
  return api.get(`/read/courseId/${courseId}`);
};
