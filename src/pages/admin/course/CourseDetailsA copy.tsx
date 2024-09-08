import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURLCourse } from "@/store/api/CourseApi";
// import { loadStripe } from "@stripe/stripe-js";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { readByEnrollmentCourseIdApi } from "@/store/api/EnrollmentApi";
// import { EnrollmentEntity } from "@/types/enrollmentEntity";
import { ICourse } from "@/types/course.entity";
import StreamingVideo from "@/components/public/course/StreamingVideo";
import ReviewsAndRatings from "@/components/public/course/ReviewsAndRatings ";
import { ReviewEntity } from "@/types/rateAndReviewEntity";
import { readRateAndReviewCourseIdApi } from "@/store/api/ReviewApi";

const CourseDetailsA: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<ICourse | null>(null);
  // const [enrolled, setEnrolled] = useState<EnrollmentEntity | null>(null);
  const [mainVideoDuration, setMainVideoDuration] = useState<number>(0);
  const [lessonDurations, setLessonDurations] = useState<{
    [key: string]: number;
  }>({});
  const [review, setReview] = useState<ReviewEntity[] | null>([]);

  // const auth = useSelector((state: RootState) => state.auth);

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

  // useEffect(() => {
  //   if (auth.userId) {
  //     (async () => {
  //       try {
  //         const response = await readByEnrollmentCourseIdApi(id!);
  //         setEnrolled(response.data.data);
  //       } catch (error) {
  //         console.error("Error checking course enrollment:", error);
  //       }
  //     })();
  //   }
  // }, [auth.userId, id]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleMainVideoDurationSet = (duration: number) => {
    setMainVideoDuration(duration);
  };

  const handleLessonVideoDurationSet = (lessonId: string, duration: number) => {
    setLessonDurations((prevDurations) => ({
      ...prevDurations,
      [lessonId]: duration,
    }));
  };

  useEffect(() => {
    const fetchReview = async () => {
      if (id) {
        const reviewResponse = await readRateAndReviewCourseIdApi(id);
        setReview(reviewResponse.data.data);
      }
    };
    fetchReview();
  }, []);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <div className="h-10 hidden lg:block"></div> */}
      <div className="w-full mx-auto">
        <div className="flex">
          <div className="bg-green-200 w-full">
            <div className="flex w-full">
              <div className="w-full p-3 px-4">
                <h1 className="font-semibold text-2xl">Course Details</h1>
                <div className="rounded-lg overflow-hidden my-3">
                  <StreamingVideo
                    publicId={course.courseDemoVideo.publicId}
                    version={course.courseDemoVideo.version}
                    controls={true}
                    onDurationSet={handleMainVideoDurationSet}
                  />
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
                    <div className="w-20 h-20 flex items-center">
                      <StreamingVideo
                        publicId={lesson.video.publicId}
                        version={lesson.video.version}
                        controls={false}
                        onDurationSet={(duration) =>
                          handleLessonVideoDurationSet(lesson._id, duration)
                        }
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h1 className="font-semibold">{lesson.lessonTitle}</h1>
                      <h6 className="text-green-400">
                        {formatDuration(lessonDurations[lesson._id] || 0)}
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
              <h6>{formatDuration(mainVideoDuration)}</h6>
            </div>
            <div className="flex justify-between my-5">
              <h6>Lessons</h6>
              <h6>{course.lessons.length}</h6>
            </div>
            <div className="flex justify-between my-5">
              <h6>Access</h6>
              <h6>Lifetime</h6>
            </div>
            {/* {enrolled?.courseId === course._id ? (
              <div className="flex justify-center w-full">
                <button className="p-2 border bg-gray-500 w-full font-bold rounded-lg my-3 text-white">
                  Already Purchased Course
                </button>
              </div>
            ) : ( */}
            <div className="flex justify-center w-full">
              <button
                className="p-2 border bg-red-500 w-full font-bold rounded-lg my-3 text-white"
                // onClick={handlePayment}
              >
                Block Course
              </button>
            </div>
            {/* // )} */}
          </div>
        </div>
        {review && review.length > 0 && <ReviewsAndRatings course={review} />}
      </div>
    </>
  );
};

export default CourseDetailsA;
