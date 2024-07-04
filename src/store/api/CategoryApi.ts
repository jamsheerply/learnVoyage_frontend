import axios, { AxiosInstance } from "axios";

interface CategoryData {
  id: string;
  categoryName?: string;
  isBlocked?: boolean;
  image: string;
}

const baseURL = `${import.meta.env.VITE_BASE_URL}/content-management/category`;

export const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const readAllCategoryApi = () => {
  return api.get("/read");
};

export const createCategoryApi = (categoryData: CategoryData) => {
  return api.post("/create", categoryData);
};

export const updateCategoryApi = (categoryData: CategoryData) => {
  return api.patch("/update", categoryData);
};

export const readByIdCategoryApi = (id: string) => {
  return api.get(`/read/${id}`);
};
