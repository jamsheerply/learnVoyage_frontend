import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  readByIdCourse,
  updateCourse,
} from "../../../store/course/coursesActions";
import { AppDispatch, RootState } from "../../../store/store";
import toast from "react-hot-toast";
import SomeWentWrong from "../../../components/public/common/SomeWentWrong";
import Modal from "../../../components/instructor/courses/Modal";
import { ICourse, ILessonContent } from "../../../types/course.entity";

interface Lesson {
  lessonId: number;
  lessonNumber: number;
  lessonTitle: string;
  description: string;
  video: { publicId: string; version: string } | null;
}

interface ErrorState {
  [key: string]: {
    lessonTitle?: string;
    description?: string;
    video?: string;
  };
}

interface VideoData {
  publicId: string;
  version: string;
  secure_url: string;
}

const lessonSchema = Yup.object().shape({
  lessonTitle: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description cannot exceed 500 characters"),
  video: Yup.object()
    .shape({
      publicId: Yup.string().required("Video is required"),
      version: Yup.string().required("Video is required"),
    })
    .nullable(),
});

const EditLesson: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [uploadingLessonId, setUploadingLessonId] = useState<number | null>(
    null
  );
  const [errors, setErrors] = useState<ErrorState>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [videoUploading, setVideoUploading] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  const { course, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    if (id) {
      dispatch(readByIdCourse(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (course?.lessons) {
      setLessons(
        course.lessons.map((lesson, index) => ({
          lessonId: index + 1,
          lessonNumber: index + 1,
          lessonTitle: lesson.lessonTitle,
          description: lesson.description,
          video: lesson.video || null,
        }))
      );
    }
  }, [course]);

  const uploadFile = async (video: File): Promise<VideoData> => {
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const uploadPreset = "videos_preset";

    const formData = new FormData();
    formData.append("file", video);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData
      );
      return {
        publicId: response.data.public_id,
        version: response.data.version.toString(),
        secure_url: response.data.secure_url,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("File upload failed. Please try again.");
      throw new Error("File upload failed. Please try again.");
    }
  };

  const handleAddLesson = () => {
    setLessons((prevLessons) => [
      ...prevLessons,
      {
        lessonId: Date.now(),
        lessonNumber: prevLessons.length + 1,
        lessonTitle: "",
        description: "",
        video: null,
      },
    ]);
  };

  const handleRemoveLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setShowModal(true);
  };

  const confirmRemoveLesson = async () => {
    if (selectedLessonId !== null) {
      setLessons((prevLessons) => {
        const updatedLessons = prevLessons
          .filter((lesson) => lesson.lessonId !== selectedLessonId)
          .map((lesson, index) => ({
            ...lesson,
            lessonNumber: index + 1,
          }));
        handleUpdateAllLessons(updatedLessons);
        return updatedLessons;
      });
    }
    setShowModal(false);
    setSelectedLessonId(null);
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
      console.log(JSON.stringify(videoUploading));
      setVideoUploading(true);

      try {
        const videoData = await uploadFile(file);
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
        console.error("File upload failed:", error);
      } finally {
        setUploadingLessonId(null);
        setVideoUploading(false);
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

  const handleUpdateAllLessons = async (updatedLessons?: Lesson[]) => {
    const lessonsToUpdate = updatedLessons || lessons;

    const isValid = await validateLessons(lessonsToUpdate);

    if (!isValid) {
      console.error("Validation failed");
      return;
    }

    if (!course) {
      console.error("Course not found");
      return;
    }

    const formattedLessons: ILessonContent[] = lessonsToUpdate.map(
      (lesson) => ({
        lessonNumber: lesson.lessonNumber.toString(),
        lessonTitle: lesson.lessonTitle,
        description: lesson.description,
        video: lesson.video || undefined,
      })
    );

    const updatedCourse: Partial<ICourse> = {
      id: course.id,
      lessons: formattedLessons,
    };

    try {
      await dispatch(updateCourse(updatedCourse as ICourse));
      toast.success("Lessons updated successfully!");
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const handleCancelClick = () => {
    if (videoUploading) {
      setShowCancelModal(true);
    } else {
      navigate(`/instructor/edit-course/${id}`);
    }
  };

  const confirmCancelUpload = () => {
    setShowCancelModal(false);
    navigate(`/instructor/edit-course/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <ClipLoader color="#ffffff" loading={loading} size={150} />
      </div>
    );
  }

  if (error) return <SomeWentWrong />;

  return (
    <div className="px-20">
      {lessons.map((lesson) => (
        <div key={lesson.lessonId} className="bg-green-100 p-5 rounded-md mb-4">
          <h1 className="mb-3">Lesson {lesson.lessonNumber}</h1>
          <div className="flex gap-6 h-60 rounded-md">
            <div className="border-2 border-gray-300 w-[40%] flex justify-center items-center relative">
              {lesson.video ? (
                <>
                  <video
                    src={`https://res.cloudinary.com/${
                      import.meta.env.VITE_CLOUD_NAME
                    }/video/upload/v${lesson.video.version}/${
                      lesson.video.publicId
                    }`}
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
                    value={lesson.lessonTitle}
                    onChange={(e) =>
                      handleInputChange(
                        lesson.lessonId,
                        "lessonTitle",
                        e.target.value
                      )
                    }
                  />
                  {errors[lesson.lessonId]?.lessonTitle && (
                    <p className="text-red-500 mx-6">
                      {errors[lesson.lessonId]?.lessonTitle}
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
              className="bg-red-500 text-white p-2 rounded-md h-10 w-10"
              onClick={() => handleRemoveLesson(lesson.lessonId)}
            >
              <X />
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <button
          className={`border-2 p-3 rounded-lg my-2 ${
            videoUploading
              ? "border-gray-300 text-gray-300 cursor-not-allowed"
              : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          }`}
          onClick={() => handleUpdateAllLessons()}
          disabled={videoUploading}
        >
          {videoUploading ? "Uploading..." : "Update All Lessons"}
        </button>
        <div className="flex gap-4">
          <div
            className="flex border-orange-500 text-orange-500 border-2 p-2 h-10 rounded-lg my-2 cursor-pointer"
            onClick={handleCancelClick}
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
      {showModal && (
        <Modal
          shouldShow={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <div className="p-4">
            <h2 className="text-xl mb-4">
              Are you sure you want to remove this lesson?
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-red-500 p-2 rounded-lg m-2"
                onClick={confirmRemoveLesson}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 p-2 rounded-lg m-2"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showCancelModal && (
        <Modal
          shouldShow={showCancelModal}
          onRequestClose={() => setShowCancelModal(false)}
        >
          <div className="p-4">
            <h2 className="text-xl mb-4">
              Are you sure you want to cancel the video upload?
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white p-2 rounded-lg m-2 hover:bg-red-600"
                onClick={confirmCancelUpload}
              >
                Yes, Cancel Upload
              </button>
              <button
                className="bg-gray-500 text-white p-2 rounded-lg m-2 hover:bg-gray-600"
                onClick={() => setShowCancelModal(false)}
              >
                No, Continue Upload
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditLesson;
