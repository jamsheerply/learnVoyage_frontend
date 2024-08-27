import React, { CSSProperties, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  readByIdCourse,
  updateCourse,
} from "../../../store/course/coursesActions";
import { AppDispatch, RootState } from "../../../store/store";
import { readAllCategory } from "../../../store/category/CategoryActions";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import SomeWentWrong from "@/components/public/common/SomeWentWrong";

interface ICourse {
  courseName: string;
  mentorId: string;
  categoryId: string;
  description: string;
  language: string;
  coursePrice: number;
  courseDemoVideo: {
    publicId: string;
    version: string;
  };
  courseThumbnailUrl: string;
  lessons: any[]; // Consider defining a more specific type for lessons
  id: string;
}

const EditCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state: RootState) => state.category);
  const {
    course: fetchedCourse,
    loading,
    error,
  } = useSelector((state: RootState) => state.courses);

  const [course, setCourse] = useState<ICourse>({
    courseName: "",
    mentorId: "",
    categoryId: "",
    description: "",
    language: "",
    coursePrice: 0,
    courseDemoVideo: {
      publicId: "",
      version: "",
    },
    courseThumbnailUrl: "",
    lessons: [],
    id: "",
  });

  const [errors, setErrors] = useState<Partial<ICourse>>({});
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(readAllCategory());
    dispatch(readByIdCourse(id!));
  }, [dispatch, id]);

  useEffect(() => {
    if (fetchedCourse) {
      setCourse((prevCourse) => ({
        ...prevCourse,
        ...fetchedCourse,
        id: fetchedCourse.id || "",
        lessons: fetchedCourse.lessons || [],
      }));
      if (fetchedCourse.courseDemoVideo?.publicId) {
        const cloudName = import.meta.env.VITE_CLOUD_NAME;
        const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/v${fetchedCourse.courseDemoVideo.version}/${fetchedCourse.courseDemoVideo.publicId}`;
        setVideoPreview(videoUrl);
      }
    }
  }, [fetchedCourse]);

  const uploadFile = async (
    file: File,
    type: "image" | "video"
  ): Promise<
    string | { publicId: string; version: string; secure_url: string }
  > => {
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
      if (type === "image") {
        const { secure_url } = res.data;
        return secure_url;
      } else {
        const { public_id, version, secure_url } = res.data;
        return { publicId: public_id, version: version.toString(), secure_url };
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error uploading file:", error.message);
        toast.error(error.message);
      } else {
        console.error("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
      throw error;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageLoading(true);
      try {
        const imgUrl = await uploadFile(file, "image");
        setImageLoading(false);
        setCourse((prevCourse) => ({
          ...prevCourse,
          courseThumbnailUrl: imgUrl as string,
        }));
      } catch (error) {
        setImageLoading(false);
        console.error("Error handling image change:", error);
      }
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setVideoLoading(true);
      try {
        const videoData = (await uploadFile(file, "video")) as {
          publicId: string;
          version: string;
          secure_url: string;
        };
        setVideoLoading(false);
        setCourse((prevCourse) => ({
          ...prevCourse,
          courseDemoVideo: {
            publicId: videoData.publicId,
            version: videoData.version,
          },
        }));
        setVideoPreview(videoData.secure_url);
      } catch (error) {
        setVideoLoading(false);
        console.error("Error handling video change:", error);
      }
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
      courseDemoVideo: {
        publicId: "",
        version: "",
      },
    }));
    setVideoPreview(null);
    const videoInput = document.getElementById("video") as HTMLInputElement;
    if (videoInput) {
      videoInput.value = "";
    }
  };

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
    courseDemoVideo: Yup.object().shape({
      publicId: Yup.string().required("Course Demo Video is required"),
      version: Yup.string().required("Course Demo Video is required"),
    }),
  });

  const handleSubmit = async () => {
    try {
      await schema.validate(course, { abortEarly: false });
      const response = await dispatch(updateCourse(course));
      const updatedCourse = response.payload as {
        success?: string;
        error?: string;
        id?: string;
      };

      if (!updatedCourse.error && updatedCourse.id) {
        toast.success("Course updated successfully!");
        navigate("/instructor/courses");
      } else {
        toast.error(updatedCourse.error || "Failed to update the course");
      }
    } catch (validationErrors) {
      const validationErrorsObj: Partial<ICourse> = {};
      (validationErrors as Yup.ValidationError).inner.forEach((error) => {
        if (error.path) {
          validationErrorsObj[error.path as keyof ICourse] = error.message;
        }
      });
      setErrors(validationErrorsObj);
      console.error("Validation errors:", validationErrors);
    }
  };

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
        <div className="lg:flex px-20 gap-10">
          <div className="w-full h-full">
            <h1 className="py-2">Course Thumbnail</h1>
            <div className="border-2 w-[100%] h-80 rounded-md flex justify-center items-center relative">
              <input
                type="file"
                accept="image/*"
                id="image"
                key={course.courseThumbnailUrl ? "image-loaded" : "image-empty"}
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
              <div className="text-red-500">{errors.courseThumbnailUrl}</div>
            )}
          </div>
          <div className="w-full h-full">
            <h1 className="py-2">Course Demo Video</h1>
            <div className="border-2 w-[100%] h-80 rounded-md flex justify-center items-center relative">
              <input
                type="file"
                accept="video/*"
                id="video"
                key={videoPreview ? "video-loaded" : "video-empty"}
                className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
                  videoPreview ? "hidden" : ""
                }`}
                onChange={handleVideoChange}
              />
              {videoLoading ? (
                <ClipLoader color="#36D7B7" />
              ) : videoPreview ? (
                <>
                  <video
                    src={videoPreview}
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
            {errors.courseDemoVideo && (
              <div className="text-red-500">Course Demo Video is required</div>
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
    </div>
  );
};
export default EditCourse;
