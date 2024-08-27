import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/custom Hooks/hooks";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllInstructorsList } from "@/store/Instructors/InstructorsActions";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import { AppDispatch, RootState } from "@/store/store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { format } from "date-fns";

const InstructorExams = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [assessment, setAssessment] = useState([]);
  const fetchAssessment = async () => {
    try {
      const baseURL = `${import.meta.env.VITE_BASE_URL}/content-management`;
      const api = axios.create({
        baseURL: baseURL,
        withCredentials: true,
      });
      const response = await api.get("/assessment/read", {
        params: {
          page,
          limit,
          search: debouncedSearch || "",
        },
      });
      setTotal(response.data.data.total);
      setAssessment(response.data.data.assessments);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, [page, limit, debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <Button
            onClick={() => {
              navigate("/instructor/create-exam");
            }}
            className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
          >
            Add Exam
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AssessmentCard assessment={assessment} />
      </div>

      {total > limit && (
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              href="#"
            />
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={`page-${index + 1}`}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              href="#"
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

const AssessmentCard = ({ assessment }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllInstructorsList());
  }, [dispatch]);

  const { instructors } = useSelector((state: RootState) => state.instructors);

  return (
    <>
      {assessment.map((assess) => {
        const mentor = instructors.find(
          (instructor) => instructor.id === assess.courseId.mentorId
        );
        const mentorName = mentor
          ? `${mentor.firstName} ${mentor.lastName}`
          : "Mentor";
        // Convert createdAt to a Date object
        const createdAtDate = new Date(assess.createdAt);
        return (
          <Card key={assess._id} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {assess.courseId?.courseName || "Untitled Assessment"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Subject: {assess.courseId?.courseName || "N/A"}
              </p>
              {/* <p className="text-sm text-gray-500">
                Instructor: {mentorName || "N/A"}
              </p> */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">
                    {format(createdAtDate, "dd/MM/yyyy hh:mm") || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">
                    {assess.maximumTime || "N/A"} minutes
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm">
                  No of questions:{" "}
                  <span className="font-semibold text-purple-600">
                    {assess.questions?.length || 0}
                  </span>
                </p>
                <p className="text-sm">
                  Passing percentage:{" "}
                  <span className="font-semibold">
                    {assess.passingPercentage || 0}%
                  </span>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate(`/instructor/edit-exam/${assess._id}`)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
};

export default InstructorExams;
