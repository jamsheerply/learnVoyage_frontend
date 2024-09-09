import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: {
    id: string;
    mentorId: string;
    courseName: string;
    categoryId: string;
    duration: string;
    studentCount: number;
    level: string;
    lessons: [] | undefined;
    coursePrice: string;
    courseThumbnailUrl: string;
  };
}
const getRandomCount = (min = 1, max = 10) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const { instructors } = useSelector((state: RootState) => state.instructors);
  const { categories } = useSelector((state: RootState) => state.category);

  const mentor = instructors.find(
    (instructor) => instructor.id === course.mentorId
  );
  const mentorName = mentor
    ? `${mentor.firstName} ${mentor.lastName}`
    : "Unknown Mentor";

  const category = categories.find(
    (category) => category.id === course.categoryId
  );
  const categoryName = category ? category.categoryName : "Unknown Category";
  // console.log("course", course.lessons.length > 0);
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-4xl h-64 mt-4 rounded-lg overflow-hidden border-2 border-gray-300 font-bold">
      <div className="w-full lg:w-1/3 h-full overflow-hidden bg-gray-200">
        <img
          className="w-full h-full object-cover"
          src={course.courseThumbnailUrl}
          alt="Course"
        />
      </div>
      <div className="w-full lg:w-2/3 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm">by {mentorName}</h3>
          <h2 className="text-lg font-semibold mt-1">{course.courseName}</h2>
          <h3 className="text-sm mt-1">Category: {categoryName}</h3>
          <div className="flex flex-wrap gap-3 mt-2 text-sm">
            <span>{course.duration || getRandomCount()} week</span>
            <span>{course.studentCount || getRandomCount()} students</span>
            <span>{course.level || "beginner"}</span>
            <span>{course.lessons ? course.lessons.length : 0} Lessons</span>
          </div>
        </div>
        <div className="flex justify-between items-center border-t-2 border-gray-200 pt-2 mt-2">
          <h3 className="text-lg font-semibold">₹{course.coursePrice}</h3>
          <button
            className="text-blue-500 hover:text-blue-700 transition-colors"
            onClick={() => navigate(`/course-details/${course.id}`)}
          >
            View more
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
