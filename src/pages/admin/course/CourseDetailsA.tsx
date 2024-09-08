import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURLCourse } from "@/store/api/CourseApi";
import { ICourse } from "@/types/course.entity";
import StreamingVideo from "@/components/public/course/StreamingVideo";
import { ReviewEntity } from "@/types/rateAndReviewEntity";
import { readRateAndReviewCourseIdApi } from "@/store/api/ReviewApi";
import { Lesson } from "@/store/course/coursesActions";
import { Book, Clock, Infinity, StarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Button } from "@/shadcn/ui/button";
import { Separator } from "@/shadcn/ui/separator";

const CourseDetailsA: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [mainVideoDuration, setMainVideoDuration] = useState<number>(0);
  const [lessonDurations, setLessonDurations] = useState<{
    [key: string]: number;
  }>({});
  const [reviews, setReviews] = useState<ReviewEntity[] | null>([]);
  const [title, setTitle] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<{
    publicId: string;
    version: string;
  } | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${baseURLCourse}/read/${id}`);
        setCourse(response.data.data);
        console.log(response.data.data);
        // Set initial video and title
        if (response.data.data.courseDemoVideo) {
          const firstLesson = response.data.data.courseDemoVideo;
          console.log(firstLesson);
          setCurrentVideo(firstLesson.video);
          setTitle(firstLesson.lessonTitle);
          setCurrentLessonId(firstLesson._id);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourse();
  }, [id]);

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

  const handleVideo = useCallback((lesson: Lesson) => {
    setCurrentVideo(lesson.video);
    setTitle(lesson.lessonTitle);
    setCurrentLessonId(lesson._id);
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      if (id) {
        const reviewResponse = await readRateAndReviewCourseIdApi(id);
        setReviews(reviewResponse.data.data);
      }
    };
    fetchReview();
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-green-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="w-full lg:w-2/3 space-y-6">
            <h1 className="text-4xl font-bold">{title ?? course.courseName}</h1>
            <Card>
              <CardContent className="p-0">
                <div className="aspect-w-16 aspect-h-9">
                  <StreamingVideo
                    publicId={
                      currentVideo?.publicId || course?.courseDemoVideo.publicId
                    }
                    version={
                      currentVideo?.version || course?.courseDemoVideo.version
                    }
                    controls={true}
                    onDurationSet={handleMainVideoDurationSet}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{course?.description}</p>
              </CardContent>
            </Card>
            {reviews && reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews and Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="flex items-center mb-2">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">
                            {review.userId.fristName}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.review}</p>
                        {index !== reviews.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center">
                    <StarIcon className="w-5 h-5 mr-2" /> Price
                  </span>
                  <span className="text-green-600 font-semibold">
                    ₹{course?.coursePrice}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center">
                    <Clock className="w-5 h-5 mr-2" /> Duration
                  </span>
                  <span>{formatDuration(mainVideoDuration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center">
                    <Book className="w-5 h-5 mr-2" /> Lessons
                  </span>
                  <span>{course?.lessons.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center">
                    <Infinity className="w-5 h-5 mr-2" /> Access
                  </span>
                  <span>Lifetime</span>
                </div>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => navigate("/admin/courses")}
                >
                  Back
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Playlists</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 p-4">
                    <div
                      className={`flex items-center rounded-lg cursor-pointer hover:bg-gray-100 transition duration-300 ${
                        currentLessonId === course?.courseDemoVideo._id
                          ? "bg-green-100"
                          : ""
                      }`}
                      onClick={() => handleVideo(course?.courseDemoVideo)}
                    >
                      <div className="w-20 h-14 flex-shrink-0 overflow-hidden rounded-l-lg">
                        <StreamingVideo
                          publicId={
                            course?.courseDemoVideo?.video?.publicId || "test"
                          }
                          version={
                            course?.courseDemoVideo?.video?.version || "test"
                          }
                          controls={false}
                          onDurationSet={(duration) =>
                            handleLessonVideoDurationSet(
                              course?.courseDemoVideo._id,
                              duration
                            )
                          }
                        />
                      </div>
                      <div className="flex-grow p-2">
                        <h3 className="font-semibold text-sm truncate">
                          {course?.courseName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatDuration(
                            lessonDurations[course?.courseDemoVideo._id] || 0
                          )}
                        </p>
                      </div>
                    </div>
                    {course?.lessons.map((lesson) => (
                      <div
                        key={lesson._id}
                        className={`flex items-center rounded-lg cursor-pointer hover:bg-gray-100 transition duration-300 ${
                          currentLessonId === lesson._id ? "bg-green-100" : ""
                        }`}
                        onClick={() => handleVideo(lesson)}
                      >
                        <div className="w-20 h-14 flex-shrink-0 overflow-hidden rounded-l-lg">
                          <StreamingVideo
                            publicId={lesson.video?.publicId || "test"}
                            version={lesson.video?.version || "test"}
                            controls={false}
                            onDurationSet={(duration) =>
                              handleLessonVideoDurationSet(lesson._id, duration)
                            }
                          />
                        </div>
                        <div className="flex-grow p-2">
                          <h3 className="font-semibold text-sm truncate">
                            {lesson.lessonTitle}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatDuration(lessonDurations[lesson._id] || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsA;
