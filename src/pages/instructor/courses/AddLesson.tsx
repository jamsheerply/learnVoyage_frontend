import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCourse } from "../../../store/course/coursesActions";
import { AppDispatch } from "../../../store/store";
import toast from "react-hot-toast";
import { ICourse, ILessonContent } from "@/types/course.entity";

interface ErrorState {
  [key: number]: {
    title?: string;
    description?: string;
    video?: string;
  };
}

interface VideoData {
  publicId: string;
  version: string;
  secure_url: string;
}

interface Lesson {
  lessonId: number;
  title: string;
  description: string;
  video: { publicId: string; version: string } | null;
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
  video: Yup.mixed()
    .nullable()
    .test("is-valid-video", "Video is required", (value) => {
      if (value === null) return false;
      return value && value.publicId && value.version;
    })
    .test("has-public-id", "Video publicId is required", (value) => {
      if (value === null) return true;
      return value && value.publicId;
    })
    .test("has-version", "Video version is required", (value) => {
      if (value === null) return true;
      return value && value.version;
    }),
});

const AddLesson = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [lessons, setLessons] = useState<Lesson[]>([
    { lessonId: Date.now(), title: "", description: "", video: null },
  ]);

  const [uploadingLessonId, setUploadingLessonId] = useState<number | null>(
    null
  );

  const [errors, setErrors] = useState<ErrorState>({});

  const uploadFile = async (video: File): Promise<VideoData> => {
    const data = new FormData();
    data.append("file", video);
    data.append("upload_preset", "videos_preset");
    try {
      const cloudName = import.meta.env.VITE_CLOUD_NAME;
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
      const res = await axios.post(api, data);
      console.log("video", res.data);
      const { public_id, version, secure_url } = res.data;
      return { publicId: public_id, version: version.toString(), secure_url };
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video");
      throw error;
    }
  };

  const handleAddLesson = () => {
    setLessons((prevLessons) => [
      ...prevLessons,
      { lessonId: Date.now(), title: "", description: "", video: null },
    ]);
  };

  const handleRemoveLesson = async (lessonId: number) => {
    if (lessons.length > 1) {
      setLessons((prevLessons) => {
        const updatedLessons = prevLessons.filter(
          (lesson) => lesson.lessonId !== lessonId
        );
        handleUploadAllLessons(updatedLessons, true);
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
        lesson.lessonId === lessonId
          ? ({ ...lesson, [field]: value } as Lesson)
          : lesson
      )
    );
  };

  const handleFileChange = async (lessonId: number, file: File | null) => {
    if (file) {
      setUploadingLessonId(lessonId);
      try {
        const videoData = await uploadFile(file);
        setUploadingLessonId(null);
        setLessons((prevLessons) =>
          prevLessons.map((lesson) =>
            lesson.lessonId === lessonId
              ? {
                  ...lesson,
                  video: {
                    publicId: videoData.publicId,
                    version: videoData.version,
                  },
                }
              : lesson
          )
        );
      } catch (error) {
        setUploadingLessonId(null);
        console.error("Error handling file change:", error);
      }
    }
  };

  const handleRemoveVideo = (lessonId: number) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.lessonId === lessonId ? { ...lesson, video: null } : lesson
      )
    );
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
          console.log("error in validate", JSON.stringify(error));
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
  console.log("errors", JSON.stringify(errors));
  console.log("lessons", JSON.stringify(lessons));
  const handleUploadAllLessons = async (
    updatedLessons?: Lesson[],
    remove = false
  ) => {
    const lessonsToUpload = updatedLessons || lessons;

    const isValid = await validateLessons(lessonsToUpload);

    if (!isValid) {
      console.log("Validation failed");
      return;
    }

    const transformedLessons: ILessonContent[] = lessonsToUpload
      .filter((lesson) => lesson.video !== null)
      .map((lesson, index) => ({
        lessonId: lesson.lessonId,
        lessonNumber: (index + 1).toString(),
        lessonTitle: lesson.title,
        description: lesson.description,
        video: lesson.video!,
      }));

    const updatedCourse: Partial<ICourse> = {
      // Change to Partial<ICourse>
      id: id!,
      lessons: transformedLessons,
    };

    try {
      await dispatch(updateCourse(updatedCourse as ICourse)); // Type assertion here
      if (!remove) {
        toast.success("lesson created successfully!");
        navigate("/instructor/courses");
      }
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
              {lesson.video ? (
                <>
                  <video
                    src={`https://res.cloudinary.com/${
                      import.meta.env.VITE_CLOUD_NAME
                    }/video/upload/v${lesson.video.version}/${
                      lesson.video.publicId
                    }.mp4`}
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
              {errors[lesson.lessonId]?.video && (
                <p className="text-red-500 absolute bottom-0 p-2">
                  {errors[lesson.lessonId]?.video}
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

export default AddLesson;
