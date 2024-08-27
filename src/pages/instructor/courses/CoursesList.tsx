import React from "react";
import { Plus } from "lucide-react";
import CourseCard from "../../../components/instructor/courses/CourseCard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { getAllCoursesList } from "../../../store/course/coursesActions";
import SomeWentWrong from "../../../components/public/common/SomeWentWrong";
import "react-loading-skeleton/dist/skeleton.css";
import CourseCardSkeleton from "../../../components/instructor/courses/CourseCardSkeleton";

const CoursesList = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Select category data from Redux store
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  // Fetch all courses on component mount
  useEffect(() => {
    dispatch(getAllCoursesList());
  }, [dispatch]);

  // Display skeleton loader while loading
  if (loading) return <CourseCardSkeleton />;

  // Display error component if there's an error
  if (error) return <SomeWentWrong />;

  return (
    <div>
      {/* Header section with title and create course button */}
      <div className="flex justify-between px-10 py-2">
        <div className="font-bold p-2 text-2xl">My Course</div>
        <div>
          <button
            className="border-2 p-2 rounded-lg border-green-500 text-green-500 flex gap-2"
            onClick={() => {
              navigate("/instructor/create-course");
            }}
          >
            <Plus /> Create Course
          </button>
        </div>
      </div>
      {/* Render course cards */}
      <div>
        <CourseCard courseData={courses} />
      </div>
    </div>
  );
};

export default CoursesList;
