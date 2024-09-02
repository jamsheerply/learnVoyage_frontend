import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosInstance } from "axios";
import { useDebounce } from "@/custom Hooks/hooks";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
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
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/shadcn/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";
import toast from "react-hot-toast";
import { readAssessmentByIdApi } from "@/store/api/AssessmentApi";
import { updateResultApi } from "@/store/api/ResultApi";
// import { createResultApi } from "@/store/api/ResultApi";

interface ExamResult {
  _id: string;
  course: string;
  category: string;
  lesson: number;
  mark: number;
  totalMark: number;
  status: "completed" | "pending" | "failed";
  assessmentId: {
    _id: string;
    courseId: {
      courseName: string;
      categoryId: {
        categoryName: string;
      };
      lessons: any[];
    };
    questions: Question[];
  };
  score: number;
}

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface AssessmentEntity {
  _id: string;
  courseId: {
    courseName: string;
  };
  maximumTime: number;
  questions: Question[];
}

interface ResultEntity {
  _id?: string;
  userId: string;
  assessmentId: string;
  status: string;
  score: number;
}

const ExamList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(4);
  const [total, setTotal] = useState<number>(0);
  const [result, setResult] = useState<ExamResult[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | undefined>();
  const [resultId, setResultId] = useState<string | undefined>();
  const [assessment, setAssessment] = useState<AssessmentEntity | null>(null);
  const [userId] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStartExam = () => {
    setIsModalOpen(false);
    setIsExamStarted(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  const fetchResults = useCallback(async () => {
    try {
      const baseURL = `${import.meta.env.VITE_BASE_URL}/content-management`;
      const api: AxiosInstance = axios.create({
        baseURL: baseURL,
        withCredentials: true,
      });
      const response = await api.get("/result/read", {
        params: {
          page,
          limit,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          ...(selectedStatus !== "all" ? { filter: selectedStatus } : {}),
        },
      });
      setResult(response.data.data.results);
      setTotal(response.data.data.total);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }, [page, limit, debouncedSearch, selectedStatus]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleOpenModal = useCallback((result: ExamResult) => {
    setIsModalOpen(true);
    setAssessmentId(result.assessmentId._id);
    setResultId(result._id);
  }, []);
  useEffect(() => {
    const fetchAssessment = async (assessmentId: string) => {
      try {
        const response = await readAssessmentByIdApi(assessmentId);
        console.log("response.data.data", JSON.stringify(assessment));
        setAssessment(response.data.data);
      } catch (error) {
        console.error("Error fetching assessment details:", error);
        toast.error("Failed to load exam details");
      }
    };
    if (assessmentId) {
      fetchAssessment(assessmentId);
    }
  }, [assessmentId]);

  return (
    <div className="max-w-7xl mx-auto px-4 ">
      {!isExamStarted ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Exams</h1>
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="max-w-xs"
              />
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {result.length ? (
              result.map((exam, index) => (
                <ExamResultCard
                  key={index}
                  exam={exam}
                  onOpenModal={() => handleOpenModal(exam)}
                />
              ))
            ) : (
              <p>no result found</p>
            )}
          </div>
          {total > limit && (
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  href="#"
                />
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, page + 1))
                  }
                  href="#"
                />
              </PaginationContent>
            </Pagination>
          )}
          <ExamModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onStartExam={handleStartExam}
            examName={assessment?.courseId.courseName || "Exam"}
            time={assessment?.maximumTime || 60}
          />
        </>
      ) : (
        <ExamInterface
          resultId={resultId}
          examName={assessment?.courseId.courseName || "Exam"}
          timeLimit={assessment?.maximumTime || 60}
          questions={assessment?.questions || []}
          userId={userId!}
          assessmentId={assessment?._id}
        />
      )}
    </div>
  );
};

const ExamResultCard: React.FC<{
  exam: ExamResult;
  onOpenModal: (id: string) => void;
}> = ({ exam, onOpenModal }) => (
  <Card className="w-full ">
    <CardContent className="flex flex-col items-start space-y-2 p-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          exam.status === "completed"
            ? "bg-green-200"
            : exam.status === "pending"
            ? "bg-yellow-200"
            : "bg-red-200"
        }`}
      >
        {exam.status === "completed" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-green-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
            />
          </svg>
        )}
        {exam.status === "pending" && (
          <span className="text-yellow-500 font-bold text-2xl">P</span>
        )}
        {exam.status === "failed" && (
          <span className="text-red-500 font-bold text-2xl">F</span>
        )}
      </div>
      <div className="text-sm font-medium">{`Course: ${exam.assessmentId.courseId.courseName}`}</div>
      <div className="text-sm font-medium">{`Category: ${exam.assessmentId.courseId.categoryId.categoryName}`}</div>
      <div className="text-sm">{`Lesson: ${exam.assessmentId.courseId.lessons.length}`}</div>
      <div className="text-sm">{`Mark: ${exam.score} / ${
        exam.assessmentId.questions.length * 10
      }`}</div>

      {(exam.status === "failed" || exam.status === "pending") && (
        <Button
          variant="outline"
          onClick={() => {
            onOpenModal(exam._id);
          }}
          className="bg-green-300 hover:bg-green-500"
        >
          {exam.status === "failed" ? "Retry" : "Try"}
        </Button>
      )}
    </CardContent>
  </Card>
);

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: () => void;
  examName: string;
  time: number;
}

const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  onStartExam,
  examName,
  time,
}) => {
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
              Don&apost close window without completing the exam
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
  resultId: string;
  questions: Question[];
  userId: string;
  assessmentId: string;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({
  examName,
  timeLimit,
  resultId,
  questions,
  userId,
  assessmentId,
}) => {
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
      const resultData: { _id?: string; status: string; score: number } = {
        _id: resultId.toString(),
        status,
        score: finalScore,
      };
      const result = await updateResultApi(resultData);
      // console.log("Exam result saved:", result);
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
    // console.log("Rendering ExamResults");
    // console.log("isExamCompleted", isExamCompleted);
    // console.log("finalScore", finalScore);
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

export default ExamList;
