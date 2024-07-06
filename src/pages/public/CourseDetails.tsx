import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseURLCourse } from "@/store/api/CourseApi";

interface Course {
  courseName: string;
  courseDemoVideoUrl: string;
  description: string;
  coursePrice: string;
  lessons: { videoUrl: string; title: string; duration: string }[];
}

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${baseURLCourse}/read/${id}`);
        setCourse(response.data.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourse();
  }, [id]);
  console.log(course);

  if (!course) {
    return <div>Loading...</div>;
  }

  const handleCourseDetail = (description: string) => {
    // Split the description into words and group by sentences
    const sentences = description
      .split(". ")
      .map((sentence) => sentence.trim());
    return (
      <ul className="list-disc list-inside">
        {sentences.map((sentence, index) => (
          <li key={index}>
            {sentence.endsWith(".") ? sentence : `${sentence}.`}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-[88%] mx-auto">
      <div className="flex">
        <div className="bg-green-200 w-full">
          <div className="flex w-full">
            <div className="w-full p-3 px-4">
              <h1 className="font-semibold">Home | Courses | Course Details</h1>
              <div className="rounded-lg overflow-hidden my-3">
                <video
                  controls
                  className="w-full h-full"
                  src={course.courseDemoVideoUrl}
                ></video>
              </div>
              <h6 className="font-bold text-2xl ml-1">{course.courseName}</h6>
            </div>
            <div className="w-[700px] p-3">
              <h1 className="font-semibold text-2xl">Course Playlists</h1>
              {course.lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="flex gap-3 bg-white px-2 rounded-lg my-2"
                >
                  <div>
                    <video className="w-20 h-20" src={lesson.videoUrl}></video>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h1 className="font-semibold">{lesson.title}</h1>
                    <h6 className="text-green-400">
                      {lesson.duration || "1:56"}
                    </h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex px-2 py-2">
        <div className=" w-full pr-36 ">
          <div>
            <h1 className="font-bold text-2xl">Course Details</h1>
            <div>{handleCourseDetail(course.description)}</div>
          </div>
        </div>
        <div className=" w-[685px] p-3 font-bold">
          <div className="flex justify-between my-5">
            <h6>Price</h6>
            <h6>₹{course.coursePrice}</h6>
          </div>
          <div className="flex justify-between my-5">
            <h6>Instructor</h6>
            <h6>Instructor 02</h6>
          </div>
          <div className="flex justify-between my-5">
            <h6>Duration</h6>
            <h6>10 days</h6>
          </div>
          <div className="flex justify-between my-5">
            <h6>Lessons</h6>
            <h6>{course.lessons.length}</h6>
          </div>
          <div className="flex justify-between my-5">
            <h6>Access</h6>
            <h6>Lifetime</h6>
          </div>
          <div className="flex justify-center w-full">
            <button className="p-2 border bg-green-500 w-full font-bold rounded-lg my-3 text-white">
              Purchase Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
