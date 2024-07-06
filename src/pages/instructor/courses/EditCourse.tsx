import React from "react";
import axios from "axios";
import { X } from "lucide-react";
import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import * as Yup from "yup";
import {
  Course,
  readByIdCourse,
  updateCourse,
} from "../../../store/course/coursesActions";
import { AppDispatch, RootState } from "../../../store/store";
import { readAllCategory } from "../../../store/category/CategoryActions";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import SomeWentWrong from "../../../components/SomeWentWrong";

const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // Select category data from Redux store
  useEffect(() => {
    dispatch(readAllCategory());
    dispatch(readByIdCourse(id!));
  }, [dispatch, id]);

  const { categories } = useSelector((state: RootState) => state.category);
  const {
    course: fetchedCourse,
    loading,
    error,
  } = useSelector((state: RootState) => state.courses);

  // Initial course state setup
  const [course, setCourse] = useState<Course>({
    courseName: "",
    categoryId: "",
    description: "",
    language: "",
    coursePrice: 0,
    courseDemoVideoUrl: "",
    courseThumbnailUrl: "",
    lessons: [],
    id: "",
  });

  useEffect(() => {
    if (fetchedCourse) {
      setCourse({
        ...fetchedCourse,
        id: fetchedCourse.id || "",
      });
    }
  }, [fetchedCourse]);

  const [errors, setErrors] = useState<Partial<Course>>({});
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);

  // File upload function
  const uploadFile = async (
    file: File,
    type: "image" | "video"
  ): Promise<string | void> => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      type === "image" ? "images_preset" : "videos_preset"
    );
    try {
      const cloudName = import.meta.env.VITE_CLOUD_NAME;
      const resourceType = type === "image" ? "image" : "video";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      return secure_url;
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageLoading(true);
      const imgUrl = await uploadFile(file, "image");
      setImageLoading(false);
      setCourse((prevCourse) => ({
        ...prevCourse,
        courseThumbnailUrl: imgUrl as string,
      }));
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setVideoLoading(true);
      const videoUrl = await uploadFile(file, "video");
      setVideoLoading(false);
      setCourse((prevCourse) => ({
        ...prevCourse,
        courseDemoVideoUrl: videoUrl as string,
      }));
    }
  };

  const removeImage = () => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      courseThumbnailUrl: "",
    }));
    const imageInput = document.getElementById("image") as HTMLInputElement;
    if (imageInput) {
      imageInput.value = "";
    }
  };

  const removeVideo = () => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      courseDemoVideoUrl: "",
    }));
    const videoInput = document.getElementById("video") as HTMLInputElement;
    if (videoInput) {
      videoInput.value = "";
    }
  };

  // Validation schema
  const schema = Yup.object().shape({
    courseName: Yup.string()
      .required("Course name is required")
      .min(3, "Course name must be at least 3 characters")
      .max(25, "Course name must be less than 25 characters"),
    categoryId: Yup.string().required("Category is required"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    language: Yup.string().required("Language is required"),
    coursePrice: Yup.number()
      .required("Price is required")
      .min(0, "Price must be a positive number"),
    courseThumbnailUrl: Yup.string().required("Course Thumbnail is required"),
    courseDemoVideoUrl: Yup.string().required("Course Demo is required"),
  });

  interface ResponseData {
    success?: string;
    error?: string;
    id?: string;
  }

  // Form submission handler
  const handleSubmit = async () => {
    try {
      await schema.validate(course, { abortEarly: false });
      const response = await dispatch(updateCourse(course));
      const updatedCourse = response.payload as ResponseData;

      if (!updatedCourse.error && updatedCourse.id) {
        toast.success("Course updated successfully!");
      } else {
        toast.error(updatedCourse.error || "Failed to update the course");
      }
    } catch (validationErrors) {
      const validationErrorsObj: Partial<Course> = {};
      (validationErrors as Yup.ValidationError).inner.forEach((error: any) => {
        validationErrorsObj[error.path as keyof Course] = error.message;
      });
      setErrors(validationErrorsObj);
      console.error("Validation errors:", validationErrors);
    }
  };

  // Format categories for dropdown
  const formattedCategories = categories.map((category) => ({
    id: category.id,
    categoryName: category.categoryName,
    isBlocked: category.isBlocked,
    image: category.image,
  }));

  const [color] = useState("#ffffff");

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "green",
  };

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <ClipLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  if (error) return <SomeWentWrong />;

  return (
    <div>
      <div className="px-20 p-2">My course / Edit course</div>
      <div>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <ClipLoader color="#36D7B7" />
          </div>
        ) : (
          <div>
            <div className="lg:flex px-20 gap-10">
              <div className="w-full h-full">
                <h1 className="py-2">Course Thumbnail</h1>
                <div className="border-2 w-[100%] h-80 rounded-md flex justify-center items-center relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="image"
                    key={
                      course.courseThumbnailUrl ? "image-loaded" : "image-empty"
                    }
                    className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
                      course.courseThumbnailUrl ? "hidden" : ""
                    }`}
                    onChange={handleImageChange}
                  />
                  {imageLoading ? (
                    <ClipLoader color="#36D7B7" />
                  ) : course.courseThumbnailUrl ? (
                    <>
                      <img
                        src={course.courseThumbnailUrl}
                        alt="Image Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        className="absolute top-2 right-2 p-2 rounded-md"
                        onClick={removeImage}
                      >
                        <X />
                      </button>
                    </>
                  ) : (
                    <p>Click to select an image</p>
                  )}
                </div>
                {errors.courseThumbnailUrl && (
                  <div className="text-red-500">
                    {errors.courseThumbnailUrl}
                  </div>
                )}
              </div>
              <div className="w-full h-full">
                <h1 className="py-2">Course Demo Video</h1>
                <div className="border-2 w-[100%] h-80 rounded-md flex justify-center items-center relative">
                  <input
                    type="file"
                    accept="video/*"
                    id="video"
                    key={
                      course.courseDemoVideoUrl ? "video-loaded" : "video-empty"
                    }
                    className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
                      course.courseDemoVideoUrl ? "hidden" : ""
                    }`}
                    onChange={handleVideoChange}
                  />
                  {videoLoading ? (
                    <ClipLoader color="#36D7B7" />
                  ) : course.courseDemoVideoUrl ? (
                    <>
                      <video
                        src={course.courseDemoVideoUrl}
                        controls
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        className="absolute top-2 right-2 p-2 rounded-md"
                        onClick={removeVideo}
                      >
                        <X />
                      </button>
                    </>
                  ) : (
                    <p>Click to select a video</p>
                  )}
                </div>
                {errors.courseDemoVideoUrl && (
                  <div className="text-red-500">
                    {errors.courseDemoVideoUrl}
                  </div>
                )}
              </div>
            </div>
            <div className="px-20 my-4">
              <div className="flex gap-10">
                <div className="w-full">
                  <h1 className="py-2">Course Name</h1>
                  <input
                    className="w-[100%] rounded-md"
                    type="text"
                    value={course.courseName}
                    onChange={(e) =>
                      setCourse({ ...course, courseName: e.target.value })
                    }
                    placeholder="Enter course name"
                  />
                  {errors.courseName && (
                    <div className="text-red-500">{errors.courseName}</div>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="py-2">Category</h1>
                  <select
                    name="category"
                    id="category"
                    className="w-[100%] rounded-md"
                    value={course.categoryId}
                    onChange={(e) =>
                      setCourse({ ...course, categoryId: e.target.value })
                    }
                  >
                    {formattedCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <div className="text-red-500">{errors.categoryId}</div>
                  )}
                </div>
              </div>
              <div className="w-full">
                <h1 className="py-2">Description</h1>
                <textarea
                  className="w-[100%] h-20 rounded-md"
                  value={course.description}
                  onChange={(e) =>
                    setCourse({ ...course, description: e.target.value })
                  }
                  placeholder="Enter course description"
                />
                {errors.description && (
                  <div className="text-red-500">{errors.description}</div>
                )}
              </div>
              <div className="flex gap-10">
                <div className="w-full">
                  <h1 className="py-2">Language</h1>
                  <input
                    className="w-[100%] rounded-md"
                    type="text"
                    value={course.language}
                    onChange={(e) =>
                      setCourse({ ...course, language: e.target.value })
                    }
                    placeholder="Enter course language"
                  />
                  {errors.language && (
                    <div className="text-red-500">{errors.language}</div>
                  )}
                </div>
                <div className="w-full">
                  <h1 className="py-2">Price</h1>
                  <input
                    className="w-[100%] rounded-md"
                    type="number"
                    value={course.coursePrice}
                    onChange={(e) =>
                      setCourse({
                        ...course,
                        coursePrice: parseFloat(e.target.value),
                      })
                    }
                    placeholder="Enter course price"
                  />
                  {errors.coursePrice && (
                    <div className="text-red-500">{errors.coursePrice}</div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-1">
                <button
                  className="border-2 p-2 my-2 w-36 rounded-lg border-orange-500 text-orange-500"
                  onClick={() => {
                    navigate("/instructor/courses");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="border-2 p-2 my-2 w-36 rounded-lg border-green-500 text-green-500"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
                <button
                  className="border-2 p-2 my-2 w-36 rounded-lg border-green-500 text-green-500"
                  onClick={() => {
                    navigate(`/instructor/edit-lesson/${course.id}`);
                  }}
                >
                  Edit Lesson
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCourse;
