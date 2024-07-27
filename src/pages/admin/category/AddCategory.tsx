import React, { useState } from "react";
import axios from "axios";
import FileUpload, {
  UploadedFile,
} from "../../../components/admin/category/FileUpload";
import PacmanLoader from "react-spinners/PacmanLoader";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  updateCategory,
} from "../../../store/category/CategoryActions";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";

interface Category {
  categoryName: string;
  isBlocked: boolean;
  image: string;
  id: string;
}

const AddCategory: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const categorySelector = useSelector((state: RootState) => state.category);
  const [category, setCategory] = useState<Category>({
    categoryName: "",
    isBlocked: false,
    image: "",
    id: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<Category>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});

  const handleFileUpload = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const schema = Yup.object().shape({
    categoryName: Yup.string()
      .required("Category name is required")
      .min(3, "Category name must be at least 3 characters")
      .max(25, "Category name must be less than 25 characters"),
    isBlocked: Yup.boolean().required("Status is required"),
  });

  const handleSubmit = async () => {
    try {
      await schema.validate(category, { abortEarly: false });

      const dispatchCategory = await dispatch(createCategory(category) as any);
      console.log(
        JSON.stringify(dispatchCategory.payload) + " just below dispach"
      );
      if (dispatchCategory.payload.error) {
        toast.error(dispatchCategory.payload.error);
        setLoading(false);
        return;
      }

      setLoading(true);

      const fileUrls: string[] = [];
      const chunkSize = 5 * 1024 * 1024;

      for (const file of uploadedFiles) {
        let start = 0;
        const end = file.size;
        let chunkId = 0;
        const fileProgress: number[] = [];

        while (start < end) {
          const chunk = file.slice(start, start + chunkSize);
          const chunkFormData = new FormData();
          chunkFormData.append("file", chunk);
          chunkFormData.append("upload_preset", "tq1e949s");
          chunkFormData.append("chunk_id", `${chunkId}`);
          chunkFormData.append("file_id", `${file.name}`);

          try {
            const response = await axios.post(
              "https://api.cloudinary.com/v1_1/dwcytg5ps/image/upload",
              chunkFormData,
              {
                headers: {
                  "X-Unique-Upload-Id": file.name,
                },
                onUploadProgress: (progressEvent) => {
                  const total = progressEvent.total ?? 1;
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / total
                  );
                  fileProgress[chunkId] = percentCompleted;
                  setProgress((prevProgress) => ({
                    ...prevProgress,
                    [file.name]:
                      fileProgress.reduce((a, b) => a + b, 0) /
                      fileProgress.length,
                  }));
                },
              }
            );
            if (response.data.secure_url) {
              fileUrls.push(response.data.secure_url);
            }
          } catch (error) {
            console.error("Error uploading chunk:", error);
            toast.error(`Error uploading ${file.name}`);
            setLoading(false);
            return;
          }

          start += chunkSize;
          chunkId++;
        }
      }

      const categoryData: Category = {
        ...category,
        id: dispatchCategory.payload.data.id,
        image: fileUrls[0] || "",
      };

      await dispatch(updateCategory(categoryData));

      if (categorySelector.error) {
        toast.error(categorySelector.error.error);
        setLoading(false);
        return;
      }

      toast.success("Category created successfully!");
      setCategory({
        categoryName: "",
        isBlocked: false,
        image: "",
        id: "",
      });
      setUploadedFiles([]);
      navigate("/admin/categories");
    } catch (validationErrors) {
      const errors: Partial<Category> = {};
      (validationErrors as Yup.ValidationError).inner.forEach((error: any) => {
        errors[error.path as keyof Category] = error.message;
      });
      setErrors(errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-3 font-semibold">Categories | Add Category</div>
      <div className="flex mx-[10%] w-[80%]">
        <div className="w-full h-full flex justify-center my-3">
          <div>
            <FileUpload onFilesAdded={handleFileUpload} progress={progress} />
          </div>
        </div>
        <div className="flex flex-col mx-36 w-[80%] my-3">
          <input
            type="text"
            placeholder="Category Name"
            className="p-3 my-3 rounded-lg"
            value={category.categoryName}
            onChange={(e) =>
              setCategory({ ...category, categoryName: e.target.value })
            }
          />
          {errors.categoryName && (
            <p className="text-red-500">{errors.categoryName}</p>
          )}
          <select
            name="isBlocked"
            id="isBlocked"
            className="my-3 rounded-lg h-12"
            value={category.isBlocked ? "blocked" : "active"}
            onChange={(e) =>
              setCategory({
                ...category,
                isBlocked: e.target.value === "blocked",
              })
            }
          >
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          {errors.isBlocked && (
            <p className="text-red-500">{errors.isBlocked}</p>
          )}
          {loading ? (
            <div className="flex items-center justify-center">
              <PacmanLoader color="#22c55e" />
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="p-3 flex justify-start border bg-green-500 w-20 rounded-lg my-3 text-white"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
