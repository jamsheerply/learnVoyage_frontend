import React, { useEffect, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { readAssessmentByIdApi } from "@/store/api/AssessmentApi";
import { ScrollArea } from "@/shadcn/ui/scroll-area";

// Define the structure for a single question
interface Question {
  question: string;
  options: string[];
  answer: string;
}

// Define the structure for the entire exam data
interface ExamData {
  instructorId: string | null;
  course: string;
  courseId: string;
  passingPercentage: number;
  numberOfQuestions: number;
  maximumTime: string;
  questions: Question[];
}

export default function AssessmentDetails() {
  const { id } = useParams<{ id: string }>();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAssessment = async (id: string) => {
      try {
        const response = await readAssessmentByIdApi(id);
        setExamData(response.data.data);
        console.log("fetchAssessment", response.data.data);
      } catch (error) {
        console.error("Error fetching assessment data:", error);
      }
    };

    if (id) {
      fetchAssessment(id);
    }
  }, [id]);

  const handleBack = () => {
    navigate("/admin/assessments");
  };

  return (
    <>
      {examData && (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground bg-green-500">
              <CardTitle className="text-2xl font-bold text-center ">
                Exam Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p>
                    <strong>Course:</strong> {examData.courseId.courseName}
                  </p>
                  <p>
                    <strong>Passing Percentage:</strong>{" "}
                    {examData.passingPercentage}%
                  </p>
                  <p>
                    <strong>Number of Questions:</strong>{" "}
                    {examData.questions.length}
                  </p>
                  <p>
                    <strong>Maximum Time:</strong> {examData.maximumTime}{" "}
                    minutes
                  </p>
                </div>
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <ul className="space-y-6">
                    {examData.questions.map((question, index) => (
                      <li key={index} className="bg-secondary p-4 rounded-lg">
                        <p className="font-semibold mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <ul className="list-disc list-inside space-y-1 mb-2">
                          {question.options.map((option, idx) => (
                            <li key={idx} className="text-sm">
                              {String.fromCharCode(65 + idx)}. {option}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm font-medium text-primary">
                          Correct Answer: {question.answer}
                        </p>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
              <Button
                onClick={handleBack}
                className="w-full mt-6 bg-primary hover:bg-primary-dark text-primary-foreground bg-green-500"
              >
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
