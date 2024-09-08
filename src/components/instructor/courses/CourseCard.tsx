import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { readAllCategory } from "../../../store/category/CategoryActions";
import { ICourse } from "@/types/course.entity";

interface CourseCardProps {
  courseData: ICourse[];
}

const CourseCard = ({ courseData }: CourseCardProps) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(readAllCategory());
  }, [dispatch]);

  // Select category data from Redux store
  const { userId } = useSelector((state: RootState) => state.auth);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10  cursor-pointer">
      {courseData.map(
        (course) =>
          userId === course.mentorId && (
            <div
              key={course.id}
              className="rounded-xl shadow-lg p-4 bg-zinc-100"
              onClick={() => {
                navigate(`/instructor/edit-course/${course._id}`);
              }}
            >
              <div className="p-5 flex flex-col">
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
                  <div>{course.categoryId.categoryName}</div>
                  <div>{course.lessons?.length || 0} Lessons</div>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default CourseCard;
