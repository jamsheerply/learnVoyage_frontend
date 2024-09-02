import { ResultEntity } from "@/types/resultEntity";
import axios, { AxiosInstance } from "axios";

const baseURL = `${import.meta.env.VITE_BASE_URL}/content-management/result`;

const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const createResultApi = (ResultData: ResultEntity) => {
  return api.post("/create", ResultData);
};

export const readResultByAssessmentIdApi = (assessmentId: string) => {
  return api.get(`read/assessmentId/${assessmentId}`);
};

export const readExamPassRateApi = () => {
  return api.get("/read/exam-pass-rate");
};

export const updateResultApi = (ResultData: {
  _id?: string;
  status: string;
  score: number;
}) => {
  return api.patch(`update/${ResultData._id}`, ResultData);
};
