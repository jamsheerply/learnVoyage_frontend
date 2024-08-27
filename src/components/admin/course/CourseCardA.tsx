import React from "react";
import { useNavigate } from "react-router-dom";
import { Course } from "../../../store/course/coursesActions";
import { useEffect } from "react";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { readAllCategory } from "../../../store/category/CategoryActions";

interface CourseCardProps {
  courseData: Course[];
}

const CourseCardA = ({ courseData }: CourseCardProps) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(readAllCategory());
  }, [dispatch]);

  // Select category data from Redux store
  const { categories } = useSelector((state: RootState) => state.category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-4 cursor-pointer ">
      {courseData.map((course) => (
        <div
          key={course.id}
          className="rounded-xl shadow-lg p-4 bg-gray-100"
          onClick={() => {
            navigate(`/instructor/edit-course/${course.id}`);
          }}
        >
          <div className=" flex flex-col bg-gray-100">
            <div className="rounded-xl overflow-hidden w-full h-52">
              <img
                src={
                  course.courseThumbnailUrl?.length
                    ? course.courseThumbnailUrl
                    : "https://dummyimage.com/600x400/000/fff"
                }
                alt={course.courseName}
                className="w-full h-full object-cover"
              />
            </div>
            <h5 className="text-xl mt-2">{course.courseName}</h5>
            <div className="flex justify-between mt-2">
              <div>
                {categories.find(
                  (category) => category.id === course.categoryId
                )?.categoryName || "Unknown Category"}
              </div>
              <div>{course.lessons?.length || 0} Lessons</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCardA;
