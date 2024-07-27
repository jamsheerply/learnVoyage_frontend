import axios, { AxiosInstance } from "axios";

const baseURL = `${import.meta.env.VITE_BASE_URL}/payment-service`;

export const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const paymentUpdateApi = (paymentId: string | null, status: string) => {
  return api.post("/update-payment", { _id: paymentId, status });
};
