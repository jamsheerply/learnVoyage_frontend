import { AssessmentEntity } from "@/types/assessmentEntity";
import axios, { AxiosInstance } from "axios";

const baseURL = `${
  import.meta.env.VITE_BASE_URL
}/content-management/assessment`;

const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const createAssessmentApi = (assessmentData: AssessmentEntity) => {
  return api.post("/create", assessmentData);
};

export const readAssessmentByIdApi = (assessmentId: string) => {
  return api.get(`/read/${assessmentId}`);
};

export const updateAssessmentApi = (
  assessmentId: string,
  assessmentData: AssessmentEntity
) => {
  return api.patch(`/update/${assessmentId}`, assessmentData);
};

export const readAssessmentByCourseIdApi = (courseId: string) => {
  return api.get(`/read/courseId/${courseId}`);
};
