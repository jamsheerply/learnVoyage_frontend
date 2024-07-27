import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURLCourse } from "@/store/api/CourseApi";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SimilarCoursesCard from "../../components/public/course/SimilarCoursesCard";
import Footer from "../../components/public/common/Footer";
import { readByEnrollmentCourseIdApi } from "@/store/api/EnrollmentApi";
import { EnrollmentEntity } from "@/types/enrollmentEntity";
import { Types } from "mongoose";

interface Course {
  _id?: Types.ObjectId;
  courseName: string;
  courseDemoVideoUrl: string;
  description: string;
  coursePrice: string;
  lessons: { videoUrl: string; title: string; duration: string }[];
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState<EnrollmentEntity | null>(null);
  const auth = useSelector((state: RootState) => state.auth);

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

  useEffect(() => {
    if (auth.userId) {
      (async () => {
        try {
          const response = await readByEnrollmentCourseIdApi(id!);
          console.log(response.data.data);
          setEnrolled(response.data.data);
        } catch (error) {
          console.error("Error checking course enrollment:", error);
        }
      })();
    }
  }, [auth.userId, id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  const handlePayment = async () => {
    try {
      if (!auth.userId) {
        return navigate("/student-auth/signin");
      }
      if (auth.role === "admin") {
        return navigate("/admin/overview");
      }
      if (auth.role === "instructor") {
        return navigate("/instructor/overview");
      }
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);

      const body = {
        data: {
          ...course,
          userId: auth.userId,
        },
      };

      const headers = {
        "Content-Type": "application/json",
        withCredentials: true,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payment-service/create-payment`,
        body,
        { headers }
      );

      console.log(response, "response from stripe");

      const result: any = stripe?.redirectToCheckout({
        sessionId: response.data.id,
      });
      if (result?.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <>
      <div className="w-[88%] mx-auto">
        <div className="flex">
          <div className="bg-green-200 w-full">
            <div className="flex w-full">
              <div className="w-full p-3 px-4">
                <h1 className="font-semibold">
                  Home | Courses | Course Details
                </h1>
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
                      <video
                        className="w-20 h-20"
                        src={lesson.videoUrl}
                      ></video>
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
          <div>
            <div className="w-full pr-36">
              <div>
                <h1 className="font-bold text-2xl">Course Details</h1>
                <div className="w-[50%]">{course.description}</div>
              </div>
            </div>
            <div className="w-full pr-36">
              <div>
                <h1 className="font-bold text-2xl">Who this course is for</h1>
                <div className="w-[50%]">{course.description}</div>
              </div>
            </div>
          </div>
          <div className="w-[685px] p-3 font-bold">
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
            {enrolled?.courseId === course._id ? (
              <div className="flex justify-center w-full">
                <button className="p-2 border bg-gray-500 w-full font-bold rounded-lg my-3 text-white">
                  Already Purchased Course
                </button>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <button
                  className="p-2 border bg-green-500 w-full font-bold rounded-lg my-3 text-white"
                  onClick={handlePayment}
                >
                  Purchase Course
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="font-bold text-2xl">Similar Courses</div>
        <SimilarCoursesCard />
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;
