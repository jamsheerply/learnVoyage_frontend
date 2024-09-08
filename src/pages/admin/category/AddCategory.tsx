import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import toast from "react-hot-toast";
import FileUpload from "../../../components/admin/category/FileUpload";
import { createCategory } from "../../../store/category/CategoryActions";
import { AppDispatch } from "@/store/store";

interface Category {
  categoryName: string;
  isBlocked: boolean;
  image: string;
  id: string;
}

const schema = Yup.object().shape({
  categoryName: Yup.string()
    .required("Category name is required")
    .min(3, "Category name must be at least 3 characters")
    .max(25, "Category name must be less than 25 characters"),
  isBlocked: Yup.boolean().required("Status is required"),
  image: Yup.string().required("Image is required").url("Must be a valid URL"),
});

const AddCategory: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category>({
    categoryName: "",
    isBlocked: false,
    image: "",
    id: "",
  });
  const [errors, setErrors] = useState<Partial<Category>>({});
  const [loading, setLoading] = useState(false);

  const handleFileUploaded = (url: string) => {
    setCategory({ ...category, image: url });
    setErrors({ ...errors, image: undefined });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCategory({
      ...category,
      [name]: name === "isBlocked" ? value === "blocked" : value,
    });
    setErrors({ ...errors, [name]: undefined });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await schema.validate(category, { abortEarly: false });

      const dispatchResult = await dispatch(createCategory(category));

      console.log("dispatchResult", dispatchResult.payload);

      if (!dispatchResult.payload.success) {
        toast.error(dispatchResult.payload.error);
      } else {
        toast.success("Category created successfully!");
        navigate("/admin/categories");
      }
    } catch (validationErrors) {
      if (validationErrors instanceof Yup.ValidationError) {
        const newErrors: Partial<Category> = {};
        validationErrors.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path as keyof Category] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Add Category</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="w-96 h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
          {errors.image && <p className="text-red-500 mt-2">{errors.image}</p>}
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <input
            type="text"
            name="categoryName"
            placeholder="Category Name"
            className="p-2 my-2 rounded-lg border border-gray-300 w-full text-sm w-2/3"
            value={category.categoryName}
            onChange={handleInputChange}
          />
          {errors.categoryName && (
            <p className="text-red-500 text-xs mb-2">{errors.categoryName}</p>
          )}

          <select
            name="isBlocked"
            className="p-2 my-2 rounded-lg border border-gray-300 w-2/3 text-sm"
            value={category.isBlocked ? "blocked" : "active"}
            onChange={handleInputChange}
          >
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          {errors.isBlocked && (
            <p className="text-red-500 text-xs mb-2">{errors.isBlocked}</p>
          )}

          <button
            onClick={handleSubmit}
            className="p-2 bg-green-500 text-white rounded-lg my-2 hover:bg-green-600 transition-colors w-full md:w-32 text-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
