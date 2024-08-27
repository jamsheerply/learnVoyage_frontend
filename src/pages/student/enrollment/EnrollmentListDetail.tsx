import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircle, Star } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { RootState } from "@/store/store";
import {
  readByEnrollmentApi,
  updateEnrollmentApi,
} from "../../../store/api/EnrollmentApi";
import { readAssessmentByCourseIdApi } from "@/store/api/AssessmentApi";
import {
  createResultApi,
  readResultByAssessmentIdApi,
} from "@/store/api/ResultApi";
import { EnrollmentCourseCardProps } from "@/components/student/enrollment/EnrollmentCourseCard";
import StreamingVideo from "@/components/public/course/StreamingVideo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcn/ui/alert-dialog";
import { Card, CardContent } from "@/shadcn/ui/card";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";
import { AssessmentEntity } from "@/types/assessmentEntity";
import { Alert, AlertDescription, AlertTitle } from "@/shadcn/ui/alert";
import { ResultEntity } from "@/types/resultEntity";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Textarea } from "@/shadcn/ui/textarea";
import * as Yup from "yup";
import { createReviewApi, readReviewCouseIdApi } from "@/store/api/ReviewApi";
import { ReviewEntity } from "@/types/rateAndReviewEntity";
import { Types } from "mongoose";

interface Video {
  publicId: string;
  version: string;
}

interface Lesson {
  _id: string;
  lessonTitle: string;
  video: Video;
}

const rateAndReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .required("Rating is required")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
  comments: Yup.string()
    .required("Comments are required")
    .min(10, "Comments must be at least 10 characters long")
    .max(500, "Comments cannot exceed 500 characters"),
});

function EnrollmentListDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { userId } = useSelector((state: RootState) => state.auth);

  const [enrollment, setEnrollment] =
    useState<EnrollmentCourseCardProps | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video>();
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [lessonDurations, setLessonDurations] = useState<
    Record<string, number>
  >({});
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentEntity | null>();
  const [assessmentStatus, setAssessmentStatus] = useState<
    "start" | "continue" | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [rateAndReviewModal, setRateAndReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState({});
  const [isAlreadyReview, setIsAlreadyReview] = useState(false);

  const fetchEnrollment = useCallback(async (enrollmentId: string) => {
    try {
      const response = await readByEnrollmentApi(enrollmentId);
      setEnrollment(response.data.data);
      setCurrentVideo(response.data.data.courseId.courseDemoVideo);
      setTitle(response.data.data.courseId.courseName);
      setCompletedLessons(
        new Set(response.data.data.progress.completedLessons || [])
      );
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchEnrollment(id);
    }
  }, [id, fetchEnrollment]);

  const handleVideo = useCallback((lesson: Lesson) => {
    setCurrentVideo(lesson.video);
    setTitle(lesson.lessonTitle);
    setCurrentLessonId(lesson._id);
  }, []);

  const handleVideoCompleted = useCallback(async () => {
    if (currentLessonId && !completedLessons.has(currentLessonId)) {
      const updatedCompletedLessons = new Set(completedLessons);
      updatedCompletedLessons.add(currentLessonId);
      setCompletedLessons(updatedCompletedLessons);

      try {
        await updateEnrollmentApi(id!, {
          progress: {
            completedLessons: Array.from(updatedCompletedLessons),
          },
        });
      } catch (error) {
        console.error("Error updating completed lessons:", error);
      }
    }
  }, [currentLessonId, completedLessons, id]);

  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const handleDurationSet = useCallback(
    (lessonId: string, duration: number) => {
      setLessonDurations((prev) => ({ ...prev, [lessonId]: duration }));
    },
    []
  );

  const checkAllLessonsCompleted = useMemo(() => {
    if (enrollment?.courseId.lessons) {
      return enrollment.courseId.lessons.every((lesson: Lesson) =>
        completedLessons.has(lesson._id)
      );
    }
    return false;
  }, [enrollment, completedLessons]);

  useEffect(() => {
    setAllLessonsCompleted(checkAllLessonsCompleted);
    if (checkAllLessonsCompleted) {
      const checkAssessmentExist = async () => {
        try {
          const assessmentData = await readAssessmentByCourseIdApi(
            enrollment?.courseId._id
          );

          setAssessment(assessmentData.data.data);
          if (assessmentData.data.success) {
            const resultData = await readResultByAssessmentIdApi(
              assessmentData.data.data._id
            );
            console.log("resultData.data", resultData.data);
            setAssessmentStatus(resultData.data.success ? "continue" : "start");
          }
        } catch (error) {
          console.error("Error checking assessment:", error);
        }
      };
      checkAssessmentExist();
    }
  }, [checkAllLessonsCompleted, id]);

  const handleAssessmentStatus = useCallback(
    (status: "start" | "continue") => {
      if (status === "start") {
        setIsModalOpen(true);
      } else if (status === "continue") {
        navigate("/student/exams");
      }
    },
    [navigate]
  );

  const handleStartExam = () => {
    setIsModalOpen(false);
    setIsExamStarted(true);
  };

  const handleRateAndReview = async () => {
    try {
      await rateAndReviewSchema.validate(
        { rating, comments },
        { abortEarly: false }
      );
      setRateAndReviewModal(false);
      setRating(0);
      setComments("");
      setErrors("");
      const reviewData: ReviewEntity = {
        userId: new Types.ObjectId(enrollment?.userId),
        courseId: enrollment?.courseId._id,
        rating: rating,
        review: comments,
      };

      const reviewReponse = await createReviewApi(reviewData);
      setIsAlreadyReview(true);
      console.log("reviewReponse", reviewReponse.data);
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  useEffect(() => {
    const fechReviewCoursId = async () => {
      if (enrollment?.courseId._id) {
        const readReviewCouseId = await readReviewCouseIdApi(
          enrollment?.courseId._id
        );
        if (readReviewCouseId.data.success) {
          setIsAlreadyReview(true);
        }
      }
    };
    fechReviewCoursId();
  }, [enrollment]);

  useEffect(() => {
    if (enrollment) {
      if (
        enrollment.courseId.lessons?.length ===
        Array.from(completedLessons).length
      ) {
        setAllLessonsCompleted(true);
      }
      console.log(
        "enrollment",
        JSON.stringify(enrollment.courseId.lessons?.length)
      );
      console.log("competedLesssons");
      console.log(Array.from(completedLessons).length);
    }
  }, [completedLessons]);

  if (!enrollment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {!isExamStarted ? (
        <>
          <div className="flex flex-col lg:flex-row bg-green-100 rounded-lg overflow-hidden">
            <div className="w-full lg:w-2/3 p-4">
              <h1 className="font-semibold text-sm mb-3">
                Home | Courses | Course Details
              </h1>
              <div className="rounded-lg overflow-hidden mb-4">
                <StreamingVideo
                  publicId={currentVideo?.publicId || "test"}
                  version={currentVideo?.version || "test"}
                  controls={true}
                  onVideoCompleted={handleVideoCompleted}
                />
              </div>
              <h2 className="font-bold text-xl md:text-2xl">{title}</h2>
            </div>
            <div className="w-full lg:w-1/3 p-4">
              <h2 className="font-semibold text-xl md:text-2xl mb-4 sticky top-0 bg-green-100">
                Course Playlists
              </h2>
              <div className="overflow-y-auto max-h-[calc(100vh-200px)] space-y-2">
                {enrollment.courseId.lessons.map((lesson: Lesson) => (
                  <div
                    key={lesson._id}
                    className={`flex items-center bg-white rounded-lg cursor-pointer ${
                      currentLessonId === lesson._id
                        ? "bg-green-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleVideo(lesson)}
                  >
                    <div className="w-20 h-14 flex-shrink-0 overflow-hidden">
                      <StreamingVideo
                        publicId={lesson.video?.publicId || "test"}
                        version={lesson.video?.version || "test"}
                        controls={false}
                        onDurationSet={(duration) =>
                          handleDurationSet(lesson._id, duration)
                        }
                      />
                    </div>
                    <div className="flex-grow p-2">
                      <h3 className="font-semibold text-sm truncate">
                        {lesson.lessonTitle}
                      </h3>
                      <p
                        className={`text-xs ${
                          currentLessonId === lesson._id
                            ? "text-green-200"
                            : "text-green-700"
                        }`}
                      >
                        {formatDuration(lessonDurations[lesson._id] || 0)}
                      </p>
                    </div>
                    <div className="pr-2">
                      {completedLessons.has(lesson._id) && (
                        <CheckCircle className="text-green-500" size={24} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {allLessonsCompleted && assessmentStatus && (
                <div className="mt-4">
                  <Button
                    onClick={() => handleAssessmentStatus(assessmentStatus)}
                    className="w-full bg-green-500 hover:bg-green-800"
                  >
                    {assessmentStatus === "start"
                      ? "Start Exam"
                      : "Continue Exam"}
                  </Button>
                </div>
              )}
              {allLessonsCompleted && !isAlreadyReview && (
                <div className="mt-4">
                  <Button
                    className="w-full bg-green-500 hover:bg-green-800"
                    onClick={() => {
                      setRateAndReviewModal(true);
                    }}
                  >
                    Rate and Review
                  </Button>
                </div>
              )}
            </div>
          </div>
          <ExamModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onStartExam={handleStartExam}
            examName={"reactjs"}
            time={5}
          />
          {rateAndReviewModal && (
            <Dialog
              open={rateAndReviewModal}
              onOpenChange={setRateAndReviewModal}
            >
              <DialogContent className="sm:max-w-[425px] bg-green-300 text-black">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-center">
                    Rate and Review {enrollment.courseId.courseName}
                  </DialogTitle>
                </DialogHeader>

                <div className="flex justify-center space-x-1 my-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer ${
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-400"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Comments</label>
                    <Textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="mt-1 bg-green-200 border-gray-700"
                    />
                    {errors.comments && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.comments}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleRateAndReview}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                >
                  SUBMIT
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </>
      ) : (
        <ExamInterface
          examName={assessment?.courseId.courseName || "Exam"}
          timeLimit={assessment?.maximumTime || 60}
          questions={assessment?.questions || []}
          userId={userId!}
          assessmentId={assessment?._id.toString()}
        />
      )}
    </div>
  );
}

const ExamModal = ({ isOpen, onClose, onStartExam, examName, time }) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-green-200 text-black max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center mb-4">
            {examName} questions
          </AlertDialogTitle>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-4 border-green-500 flex items-center justify-center">
                <div className="w-1 h-6 bg-green-500 transform -rotate-45 origin-bottom"></div>
              </div>
            </div>
          </div>
          <AlertDialogDescription className="text-center mb-4">
            <p className="font-semibold mb-2 text-black">Time Limit: {time}</p>
            <p className="text-sm text-black">
              Complete the exam within the allocated time to know your what you
              studeied.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <p className="text-sm text-red-600">
              Carefully read each question before answering
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <p className="text-sm text-red-600">
              Don't close window without completing the exam
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <p className="text-sm text-red-600">
              Ensure a stable internet connection
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-transparent text-black border-black hover:bg-gray-700"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={onStartExam}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Start Exam
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface ExamInterfaceProps {
  examName: string;
  timeLimit: number;
  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
  onComplete: (score: number) => void;
  userId: string;
  assessmentId: string;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({
  examName,
  timeLimit,
  questions,
  userId,
  assessmentId,
}) => {
  // const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [score, setScore] = useState(0);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const completeExam = useCallback(async () => {
    if (isExamCompleted) return;

    const lastQuestionScore =
      currentQuestionIndex === questions.length - 1 &&
      selectedAnswer === questions[currentQuestionIndex].answer
        ? 10
        : 0;
    const finalScore = score + lastQuestionScore;
    const status =
      finalScore === questions.length * 10 ? "completed" : "failed";

    try {
      const resultData: ResultEntity = {
        userId,
        assessmentId,
        status,
        score: finalScore,
      };
      const result = await createResultApi(resultData);
      console.log("Exam result saved:", result);
      setFinalScore(finalScore);
      setIsExamCompleted(true);
    } catch (error) {
      console.error("Error saving exam result:", error);
      setError("Failed to save exam result. Please try again.");
    }
  }, [
    score,
    selectedAnswer,
    questions,
    currentQuestionIndex,
    userId,
    assessmentId,
    isExamCompleted,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          completeExam();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, completeExam]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleNextQuestion = () => {
    setScore((prevScore) => {
      const newScore =
        questions[currentQuestionIndex].answer === selectedAnswer
          ? prevScore + 10
          : prevScore;
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        return newScore;
      } else {
        completeExam();
        return newScore;
      }
    });
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(timeLimit * 60);
    setIsExamCompleted(false);
    setError(null);
    setFinalScore(null);
  };

  if (isExamCompleted && finalScore !== null) {
    console.log("Rendering ExamResults");
    console.log("isExamCompleted", isExamCompleted);
    console.log("finalScore", finalScore);
    return (
      <ExamResults
        score={finalScore}
        totalQuestions={questions.length}
        onRetry={handleRetry}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{examName}</h2>
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <p className="mb-4">{currentQuestion.question}</p>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end items-center">
          <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
            {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ExamResults: React.FC<{
  score: number;
  totalQuestions: number;
  onRetry: () => void;
}> = ({ score, totalQuestions, onRetry }) => {
  const navigate = useNavigate();
  const correctAnswers = Math.round(score / 10);
  const wrongAnswers = totalQuestions - correctAnswers;
  const status =
    score === 0
      ? "Failed"
      : score === totalQuestions * 10
      ? "Passed"
      : "Completed";
  const statusColor =
    status === "Failed"
      ? "text-red-500"
      : status === "Passed"
      ? "text-green-500"
      : "text-yellow-500";

  const handleFinish = () => {
    navigate("/student/exams");
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-green-200 text-black">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Exam Results</h2>

        <div className="flex justify-center mb-6">
          <div
            className={`w-32 h-32 ${
              status === "Failed" ? "bg-red-500" : "bg-green-500"
            } rounded-full flex items-center justify-center`}
          >
            {status === "Failed" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-sm mb-1">Score</p>
            <p className="text-2xl font-bold">
              {score}/{totalQuestions * 10}
            </p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-sm mb-1">Status</p>
            <p className={`text-2xl font-bold ${statusColor}`}>{status}</p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center bg-green-100 p-2 rounded">
            <span>Correct Answers</span>
            <span className="bg-green-500 text-white px-2 py-1 rounded">
              {correctAnswers}
            </span>
          </div>
          <div className="flex justify-between items-center bg-green-100 p-2 rounded">
            <span>Wrong Answers</span>
            <span className="bg-red-500 text-white px-2 py-1 rounded">
              {wrongAnswers}
            </span>
          </div>
        </div>

        {status === "Failed" ? (
          <Button
            onClick={onRetry}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Retry Exam
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            Finish
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrollmentListDetail;
