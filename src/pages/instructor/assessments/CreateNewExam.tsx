import React, { useEffect, useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Slider } from "@/shadcn/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Label } from "@/shadcn/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Pencil } from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesList } from "@/store/course/coursesActions";
import * as Yup from "yup";
import {
  createAssessmentApi,
  readAssessmentByCourseIdApi,
} from "@/store/api/AssessmentApi";
import { Types } from "mongoose";
import { AssessmentEntity } from "@/types/assessmentEntity";
import { ICourse } from "@/types/course.entity";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Define the structure for a single question
interface Question {
  question: string;
  options: string[];
  answer: string;
}

// Define the structure for the entire exam data
interface ExamData {
  instructorId: Types.ObjectId;
  course: string;
  courseId: string;
  passingPercentage: number;
  numberOfQuestions: number;
  maximumTime: string;
  questions: Question[];
}

const CreateNewExam: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useSelector((state: RootState) => state.auth);
  // State to hold all exam data
  const [examData, setExamData] = useState<ExamData>({
    course: "",
    instructorId: new Types.ObjectId(userId),
    courseId: "",
    passingPercentage: 0,
    numberOfQuestions: 0,
    maximumTime: "",
    questions: [],
  });

  // State to keep track of the current step in the exam creation process
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Handler to update exam details in the ExamDetailsForm
  const handleInputChange = (field: keyof ExamData, value: string | number) => {
    setExamData((prevData) => ({
      ...prevData,
      [field]:
        field === "numberOfQuestions" ? parseInt(value as string) || 0 : value,
    }));
  };

  // Handler to update a specific question in the AddQuestionForm
  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string
  ) => {
    setExamData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      return { ...prevData, questions: updatedQuestions };
    });
  };

  // Handler to update a specific option for a question in the AddQuestionForm
  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setExamData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions[optionIndex] = value;
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };
      return { ...prevData, questions: updatedQuestions };
    });
  };

  // Handler to move to the next step in the exam creation process
  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentStep === 0) {
      try {
        const response = await readAssessmentByCourseIdApi(examData.courseId);
        if (response.data.success) {
          console.debug("response.data.data.success");
          console.debug(response.data.success);
          toast.error("An assessment for this course already exists");
          return;
        }
      } catch (error) {
        console.log(error);
      }
      setExamData((prevData) => {
        const newQuestions = Array(prevData.numberOfQuestions)
          .fill(null)
          .map((_, index) => {
            if (index < prevData.questions.length) {
              // Preserve existing question data
              return prevData.questions[index];
            } else {
              // Add new empty question for additional slots
              return {
                question: "",
                options: ["", "", "", ""],
                answer: "",
              };
            }
          });

        return {
          ...prevData,
          questions: newQuestions,
        };
      });
      setCurrentStep(1);
    } else if (currentStep < examData.numberOfQuestions) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      setCurrentStep(examData.numberOfQuestions + 1);
    }
  };

  // Handler to move back to the previous step
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    } else {
      setCurrentStep(0);
    }
  };

  // New handler for the Finish button
  const handleFinish = async () => {
    console.log("Exam finished: ", JSON.stringify(examData));
    const createExam: AssessmentEntity = {
      instructorId: examData.instructorId,
      courseId: new Types.ObjectId(examData.courseId),
      maximumTime: Number(examData.maximumTime),
      passingPercentage: examData.passingPercentage,
      questions: examData.questions,
    };
    const response = await createAssessmentApi(createExam);
    if (response.data.data) {
      navigate("/instructor/exams");
      toast.success("successfully add exam");
    }
    console.log("response", JSON.stringify(response.data.data));
  };

  // New handler for the Edit button
  const handleEdit = () => {
    setCurrentStep(0);
    console.log("handleEdit: ", JSON.stringify(examData));
  };

  // Function to render the appropriate form based on the current step
  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <ExamDetailsForm
          examData={examData}
          handleInputChange={handleInputChange}
          handleContinue={handleContinue}
        />
      );
    } else if (currentStep <= examData.numberOfQuestions) {
      return (
        <AddQuestionForm
          question={examData.questions[currentStep - 1]}
          questionIndex={currentStep - 1}
          handleQuestionChange={handleQuestionChange}
          handleOptionChange={handleOptionChange}
          handleBack={handleBack}
          handleContinue={handleContinue}
          currentStep={currentStep}
          totalSteps={examData.numberOfQuestions}
        />
      );
    } else {
      return (
        <Summary
          examData={examData}
          handleFinish={handleFinish}
          handleEdit={handleEdit}
        />
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      {renderStep()}
    </div>
  );
};

// Component for the initial exam details form
interface ExamDetailsFormProps {
  examData: ExamData;
  handleInputChange: (field: keyof ExamData, value: string | number) => void;
  handleContinue: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ExamDetailsForm: React.FC<ExamDetailsFormProps> = ({
  examData,
  handleInputChange,
  handleContinue,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch all courses on component mount
  useEffect(() => {
    dispatch(getAllCoursesList());
  }, [dispatch]);

  const { courses } = useSelector((state: RootState) => state.courses);
  const { userId } = useSelector((state: RootState) => state.auth);

  const validationSchema = Yup.object().shape({
    courseId: Yup.string().required("Course is required"),
    passingPercentage: Yup.number()
      .min(10, "Passing percentage must be at least 10")
      .max(100, "Passing percentage must be at most 100")
      .required("Passing percentage is required"),
    numberOfQuestions: Yup.number()
      .min(1, "Number of questions must be at least 1")
      .required("Number of questions is required"),
    maximumTime: Yup.number()
      .min(1, "Maximum time must be at least 1 minute")
      .required("Maximum time is required"),
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await validationSchema.validate(examData, { abortEarly: false });
      setErrors({});
      handleContinue(e as unknown as React.MouseEvent<HTMLButtonElement>);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Exam</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="course"
              className="text-sm font-medium text-gray-700"
            >
              Select Course
            </Label>
            <Select
              value={examData.courseId}
              onValueChange={(value) => {
                const selectedCourse = courses.find(
                  (course) => course.id === value
                );
                handleInputChange("courseId", value);
                handleInputChange(
                  "course",
                  selectedCourse ? selectedCourse.courseName : ""
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(
                  (course: ICourse) =>
                    userId === course.mentorId && (
                      <SelectItem key={course.id} value={course.id}>
                        {course.courseName}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>
            {errors.courseId && ( // Changed from errors.course
              <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor="passingPercentage"
              className="text-sm font-medium text-gray-700"
            >
              Passing mark Percentage
            </Label>
            <Slider
              defaultValue={[examData.passingPercentage]}
              max={100}
              step={1}
              className="mt-2 bg-green-500"
              onValueChange={(value) =>
                handleInputChange("passingPercentage", value[0])
              }
            />
            <p className="text-sm text-gray-500 mt-1">
              {examData.passingPercentage}%
            </p>
            {errors.passingPercentage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passingPercentage}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="numberOfQuestions"
              className="text-sm font-medium text-gray-700"
            >
              Number of Questions
            </Label>
            <Input
              id="numberOfQuestions"
              type="number"
              placeholder="Enter number of questions"
              className="mt-1"
              value={examData.numberOfQuestions}
              onChange={(e) =>
                handleInputChange("numberOfQuestions", e.target.value)
              }
            />
            {errors.numberOfQuestions && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numberOfQuestions}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="maximumTime"
              className="text-sm font-medium text-gray-700"
            >
              Maximum Time
            </Label>
            <Input
              id="maximumTime"
              type="number"
              placeholder="Enter maximum time in minutes"
              className="mt-1"
              value={examData.maximumTime}
              onChange={(e) => handleInputChange("maximumTime", e.target.value)}
            />
            {errors.maximumTime && (
              <p className="text-red-500 text-sm mt-1">{errors.maximumTime}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Component for adding individual questions
interface AddQuestionFormProps {
  question: Question;
  questionIndex: number;
  handleQuestionChange: (
    index: number,
    field: keyof Question,
    value: string
  ) => void;
  handleOptionChange: (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => void;
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleContinue: (e: React.MouseEvent<HTMLButtonElement>) => void;
  currentStep: number;
  totalSteps: number;
}

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({
  question,
  questionIndex,
  handleQuestionChange,
  handleOptionChange,
  handleBack,
  handleContinue,
  currentStep,
  totalSteps,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string | string[] }>(
    {}
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await Yup.object()
        .shape({
          question: Yup.string().required("Question is required"),
          options: Yup.array()
            .of(Yup.string().required("Option is required"))
            .min(2, "At least two options are required")
            .test(
              "unique-options",
              "All options must be unique",
              function (options) {
                return (
                  options !== undefined &&
                  new Set(options).size === options.length
                );
              }
            )
            .defined(),
          answer: Yup.string()
            .test(
              "answer-in-options",
              "Correct answer must be one of the options",
              function (answer) {
                const { options } = this.parent;
                return options !== undefined && options.includes(answer);
              }
            )
            .required("Correct answer is required"),
        })
        .validate(question, { abortEarly: false });

      handleContinue(e as unknown as React.MouseEvent<HTMLButtonElement>);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: { [key: string]: string | string[] } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            if (err.path.startsWith("options.")) {
              if (!newErrors.options) {
                newErrors.options = [];
              }
              const index = parseInt(err.path.split(".")[1], 10);
              (newErrors.options as string[])[index] = err.message;
            } else {
              newErrors[err.path] = err.message;
            }
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add New Question</CardTitle>
        <div className="w-full bg-green-600 h-2 mt-2">
          <div
            className="bg-green-300 h-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {currentStep}/{totalSteps} Steps
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="question"
              className="text-sm font-medium text-gray-700"
            >
              Question
            </Label>
            <Input
              id="question"
              type="text"
              placeholder="Enter the question"
              className="mt-1"
              value={question.question}
              onChange={(e) =>
                handleQuestionChange(questionIndex, "question", e.target.value)
              }
            />
            {errors.question && (
              <p className="text-red-500 text-sm mt-1">
                {errors.question as string}
              </p>
            )}
          </div>

          <RadioGroup
            onValueChange={(value) =>
              handleQuestionChange(
                questionIndex,
                "answer",
                question.options[parseInt(value.slice(-1)) - 1]
              )
            }
            className="space-y-2"
          >
            {question.options.map((option, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={`option${index + 1}`}
                    id={`option${index + 1}`}
                  />
                  <Input
                    id={`optionInput${index + 1}`}
                    type="text"
                    placeholder={`Enter option ${index + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(questionIndex, index, e.target.value)
                    }
                    className="flex-grow"
                  />
                </div>
                {Array.isArray(errors.options) && errors.options[index] && (
                  <p className="text-red-500 text-sm ml-6">
                    {errors.options[index]}
                  </p>
                )}
              </div>
            ))}
          </RadioGroup>
          {errors.options && !Array.isArray(errors.options) && (
            <p className="text-red-500 text-sm">{errors.options as string}</p>
          )}
          {errors.answer && (
            <p className="text-red-500 text-sm">{errors.answer as string}</p>
          )}

          <div className="flex justify-between mt-4">
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Component to display the summary of the created exam
interface SummaryProps {
  examData: ExamData;
  handleFinish: () => void;
  handleEdit: () => void;
}

const Summary: React.FC<SummaryProps> = ({
  examData,
  handleFinish,
  handleEdit,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Summary</CardTitle>
        <Button onClick={handleEdit} variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            <strong>Course:</strong> {examData.course}
          </p>
          <p>
            <strong>Passing Percentage:</strong> {examData.passingPercentage}%
          </p>
          <p>
            <strong>Number of Questions:</strong> {examData.numberOfQuestions}
          </p>
          <p>
            <strong>Maximum Time:</strong> {examData.maximumTime} minutes
          </p>
          <p>
            <strong>Questions:</strong>
          </p>
          <ul>
            {examData.questions.map((question, index) => (
              <li key={index}>
                <p>
                  {index + 1}. {question.question}
                </p>
                <ul>
                  {question.options.map((option, idx) => (
                    <li key={idx}>
                      {String.fromCharCode(65 + idx)}. {option}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Correct Answer:</strong> {question.answer}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <Button
          onClick={handleFinish}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
        >
          Finish
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateNewExam;
