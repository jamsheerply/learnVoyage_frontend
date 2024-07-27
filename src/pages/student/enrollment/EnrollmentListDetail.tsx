import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { readByEnrollmentApi } from "../../../store/api/EnrollmentApi";
import { EnrollmentCourseCardProps } from "@/components/student/enrollment/EnrollmentCourseCard";

function EnrollmentListDetail() {
  const { id } = useParams<{ id: string }>();
  const [enrollment, setEnrollment] =
    useState<EnrollmentCourseCardProps | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [tittle, setTittle] = useState<string>("");

  useEffect(() => {
    const fetchCourse = async (id: string) => {
      try {
        const response = await readByEnrollmentApi(id);
        setEnrollment(response.data.data);
        setVideoUrl(response.data.data.courseId.courseDemoVideoUrl);
        setTittle(response.data.data.courseId.courseName);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    if (id) {
      fetchCourse(id);
    }
  }, [id]);

  const handleVideo = (lesson: any) => {
    setVideoUrl(lesson.videoUrl);
    setTittle(lesson.title);
    setCurrentLessonId(lesson._id);
  };

  if (!enrollment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[97%] mx-auto">
      <div className="flex">
        <div className="bg-green-200 w-full">
          <div className="flex w-full">
            <div className="w-full p-3 px-4">
              <h1 className="font-semibold">Home | Courses | Course Details</h1>
              <div className="rounded-lg overflow-hidden my-3">
                <video
                  controls
                  className="w-full h-full"
                  src={videoUrl}
                ></video>
              </div>
              <h6 className="font-bold text-2xl ml-1">{tittle}</h6>
            </div>
            <div className="w-[700px] p-3">
              <h1 className="font-semibold text-2xl sticky top-0 left-0 bg-green-200">
                Course Playlists
              </h1>
              <div
                key={enrollment._id?.toString()}
                className="overflow-y-auto h-[500px]"
              >
                {enrollment.courseId.lessons.map(
                  (lesson: any, index: number) => (
                    <div
                      key={index}
                      className={`flex gap-3 bg-white px-2 rounded-lg my-2 cursor-pointer ${
                        currentLessonId === lesson._id ? "bg-green-500" : ""
                      }`}
                      onClick={() => handleVideo(lesson)}
                    >
                      <div>
                        <video
                          className="w-20 h-20"
                          src={lesson.videoUrl}
                        ></video>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h1 className="font-semibold">{lesson.title}</h1>
                        <h6 className="text-green-400">
                          {lesson.duration || "N/A"}
                        </h6>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrollmentListDetail;
