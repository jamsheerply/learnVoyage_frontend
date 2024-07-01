import { useState } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  CourseWithLesson,
  Lesson,
  updateCourse,
} from "../../../store/course/coursesActions";
import { AppDispatch } from "../../../store/store";
import toast from "react-hot-toast";

interface ErrorState {
  [key: number]: {
    title?: string;
    description?: string;
    videoUrl?: string;
  };
}

const lessonSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description cannot exceed 500 characters"),
  videoUrl: Yup.string()
    .required("Video  is required")
    .url("Invalid URL format"),
});

export const AddLesson = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [lessons, setLessons] = useState<Lesson[]>([
    { lessonId: Date.now(), title: "", description: "", videoUrl: null },
  ]);

  const [uploadingLessonId, setUploadingLessonId] = useState<number | null>(
    null
  );

  const [errors, setErrors] = useState<ErrorState>({});

  const uploadFile = async (video: File): Promise<string | void> => {
    const sliceSize = 6000000;
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const uploadPreset = "videos_preset";
    const uniqueUploadId = +new Date();

    let start = 0;
    const size = video.size;

    const uploadChunk = async (start: number, end: number) => {
      const formData = new FormData();
      const chunk = video.slice(start, end);
      formData.append("file", chunk);
      formData.append("upload_preset", uploadPreset);
      formData.append("cloud_name", cloudName);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData,
        {
          headers: {
            "X-Unique-Upload-Id": uniqueUploadId.toString(),
            "Content-Range": `bytes ${start}-${end - 1}/${size}`,
          },
        }
      );

      return response.data.secure_url;
    };

    while (start < size) {
      let end = start + sliceSize;
      if (end > size) {
        end = size;
      }
      const secureUrl = await uploadChunk(start, end);
      if (end === size) {
        return secureUrl;
      }
      start += sliceSize;
    }
  };

  const handleAddLesson = () => {
    setLessons((prevLessons) => [
      ...prevLessons,
      { lessonId: Date.now(), title: "", description: "", videoUrl: null },
    ]);
  };

  const handleRemoveLesson = async (lessonId: number) => {
    if (lessons.length > 1) {
      setLessons((prevLessons) => {
        const updatedLessons = prevLessons.filter(
          (lesson) => lesson.lessonId !== lessonId
        );
        handleUploadAllLessons(updatedLessons);
        return updatedLessons;
      });
    } else {
      alert("At least one lesson must be present.");
    }
  };

  const handleInputChange = (
    lessonId: number,
    field: keyof Lesson,
    value: string | null
  ) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.lessonId === lessonId ? { ...lesson, [field]: value } : lesson
      )
    );
  };

  const handleFileChange = async (lessonId: number, file: File | null) => {
    if (file) {
      setUploadingLessonId(lessonId);
      const videoUrl = await uploadFile(file);
      setUploadingLessonId(null);
      handleInputChange(lessonId, "videoUrl", videoUrl as string);
    }
  };

  const handleRemoveVideo = (lessonId: number) => {
    handleInputChange(lessonId, "videoUrl", null);
    const videoInput = document.getElementById(
      `video-input-${lessonId}`
    ) as HTMLInputElement;
    if (videoInput) {
      videoInput.value = "";
    }
  };

  const validateLessons = async (lessons: Lesson[]) => {
    const newErrors: ErrorState = {};
    await Promise.all(
      lessons.map(async (lesson) => {
        try {
          await lessonSchema.validate(lesson, { abortEarly: false });
        } catch (error) {
          if (error instanceof Yup.ValidationError) {
            newErrors[lesson.lessonId] = error.inner.reduce((acc, err) => {
              if (err.path) {
                acc[err.path as keyof Lesson] = err.message;
              }
              return acc;
            }, {} as { [key in keyof Lesson]?: string });
          }
        }
      })
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUploadAllLessons = async (updatedLessons?: Lesson[]) => {
    const lessonsToUpload = updatedLessons || lessons;

    const isValid = await validateLessons(lessonsToUpload);

    if (!isValid) {
      console.error("Validation failed");
      return;
    }

    const updatedCourse: CourseWithLesson = {
      id: id!,
      lessons: lessonsToUpload,
    };
    try {
      await dispatch(updateCourse(updatedCourse));
      toast.success("lesson created successfully!");
      navigate("/instructor/courses");
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };
  return (
    <div className="px-20">
      {lessons.map((lesson) => (
        <div key={lesson.lessonId} className="bg-green-100 p-5 rounded-md mb-4">
          <h1 className="mb-3">Lesson {lessons.indexOf(lesson) + 1}</h1>
          <div className="flex gap-6 h-60 rounded-md">
            <div className="border-2 border-gray-300 w-[40%] flex justify-center items-center relative">
              {lesson.videoUrl ? (
                <>
                  <video
                    src={lesson.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 p-2 rounded-md"
                    onClick={() => handleRemoveVideo(lesson.lessonId)}
                  >
                    <X />
                  </button>
                </>
              ) : uploadingLessonId === lesson.lessonId ? (
                <ClipLoader color="#36D7B7" />
              ) : (
                <div
                  className="w-full h-full flex justify-center items-center cursor-pointer"
                  onClick={() =>
                    document
                      .getElementById(`video-input-${lesson.lessonId}`)
                      ?.click()
                  }
                >
                  <p>Click to select a video</p>
                  <input
                    type="file"
                    accept="video/*"
                    id={`video-input-${lesson.lessonId}`}
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(
                        lesson.lessonId,
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                  />
                </div>
              )}
              {errors[lesson.lessonId]?.videoUrl && (
                <p className="text-red-500 absolute bottom-0  p-2">
                  {errors[lesson.lessonId]?.videoUrl}
                </p>
              )}
            </div>
            <div className="w-[60%]">
              <div>
                <h1 className="mx-6 my-2">Title</h1>
                <span>
                  <input
                    type="text"
                    className="w-[90%] rounded-md mx-6"
                    value={lesson.title}
                    onChange={(e) =>
                      handleInputChange(
                        lesson.lessonId,
                        "title",
                        e.target.value
                      )
                    }
                  />
                  {errors[lesson.lessonId]?.title && (
                    <p className="text-red-500 mx-6">
                      {errors[lesson.lessonId]?.title}
                    </p>
                  )}
                </span>
              </div>
              <div>
                <h1 className="mx-6 my-2">Description</h1>
                <span>
                  <textarea
                    className="mx-6 w-[90%] h-28 rounded-md"
                    value={lesson.description}
                    onChange={(e) =>
                      handleInputChange(
                        lesson.lessonId,
                        "description",
                        e.target.value
                      )
                    }
                  />
                  {errors[lesson.lessonId]?.description && (
                    <p className="text-red-500 mx-6">
                      {errors[lesson.lessonId]?.description}
                    </p>
                  )}
                </span>
              </div>
            </div>
            <button
              className="bg-red-500 text-white p-2 rounded-md h-10 w-10 "
              onClick={() => handleRemoveLesson(lesson.lessonId)}
              disabled={lessons.length === 1}
            >
              <X />
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <button
          className="border-green-500 text-green-500 border-2 p-3 rounded-lg my-2"
          onClick={() => handleUploadAllLessons()}
        >
          Upload All Lessons
        </button>
        <div className="flex gap-4">
          <div
            className="flex border-orange-500 text-orange-500 border-2 p-2 h-10 rounded-lg my-2 cursor-pointer"
            onClick={() => {
              navigate(`/instructor/edit-course/${id}`);
            }}
          >
            <button className="ml-2 flex justify-center items-center">
              Cancel
            </button>
          </div>
          <div
            className="flex border-green-500 text-green-500 border-2 p-2 h-10 rounded-lg my-2 cursor-pointer"
            onClick={handleAddLesson}
          >
            <Plus />
            <button className="ml-2">Add Lesson</button>
          </div>
        </div>
      </div>
    </div>
  );
};
