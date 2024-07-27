import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { getAllCoursesList } from "@/store/course/coursesActions";
import CourseCardSkeleton from "@/components/instructor/courses/CourseCardSkeleton";
import SomeWentWrong from "@/components/public/common/SomeWentWrong";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import CourseCardA from "@/components/admin/course/CourseCardA";

function CourseListA() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Select category data from Redux store
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  console.log(JSON.stringify(courses));
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
      <div className="flex justify-between p-2 px-10">
        <div className="font-bold  text-2xl">Course List</div>
      </div>
      {/* Render course cards */}
      <div className="px-5">
        <CourseCardA courseData={courses} />
      </div>
    </div>
  );
}

export default CourseListA;
