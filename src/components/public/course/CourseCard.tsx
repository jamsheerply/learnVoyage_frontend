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
    lesson: [] | undefined;
    coursePrice: string;
    courseThumbnailUrl: string;
  };
}

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

  console.log(JSON.stringify(categories));
  console.log(JSON.stringify(course));

  return (
    // {if course.length= 0 not thing to show try some other opetion}
    <div className="flex lg:flex-row flex-col w-[80%] mt-4 lg:rounded-lg overflow-hidden border-2 border-gray-300 font-bold">
      <div className="w-96 h-full overflow-hidden bg-green-500">
        <img
          className="w-full h-full"
          src={course.courseThumbnailUrl}
          alt="Course"
        />
      </div>
      <div className="w-full p-2 flex flex-col justify-between gap-2">
        <div>
          <h1>by {mentorName}</h1>
          <h2>Name: {course.courseName}</h2>
          <h2>Category: {categoryName}</h2>
          <div className="flex gap-3">
            <h5>{course.duration || "2"} week</h5>
            <h5>{course.studentCount || 40} students</h5>
            <h5>{course.level || "beginner"}</h5>
            <h5>{course.lesson ? course.lesson.length : 0} Lessons</h5>
          </div>
        </div>
        <div className="flex justify-between border-t-2 border-gray-200 pt-2">
          <h5>₹{course.coursePrice}</h5>
          <h5
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate(`/course-details/${course.id}`)}
          >
            View more
          </h5>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
