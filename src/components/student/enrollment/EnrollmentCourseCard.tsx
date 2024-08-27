import React from "react";
import { Button } from "@/shadcn/ui/button";
import { Progress } from "@/shadcn/ui/progress";
import { Book, ChevronRight, Trophy, User } from "lucide-react";
import { Types } from "mongoose";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export interface EnrollmentCourseCardProps {
  _id?: Types.ObjectId;
  userId: string;
  courseId: {
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
  enrolledAt?: Date | string;
  progress?: {
    completedLessons?: Types.ObjectId[] | [] | null;
    completedAssessments?: Types.ObjectId[] | [] | null;
  };
}

interface Props {
  enrollment: EnrollmentCourseCardProps[];
}

function EnrollmentCourseCard({ enrollment }: Props) {
  const navigate = useNavigate();
  const { instructors } = useSelector((state: RootState) => state.instructors);

  return (
    // grid of card
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 px-4 py-2 cursor-pointer">
      {/* card parent */}
      {enrollment.map((enroll) => {
        const mentor = instructors.find(
          (instructor) => instructor.id === enroll.courseId.mentorId
        );
        const mentorName = mentor
          ? `${mentor.firstName} ${mentor.lastName}`
          : "Mentor";
        const progressPercentage =
          enroll.progress && enroll.progress.completedLessons
            ? (enroll.progress.completedLessons.length /
                (enroll.courseId.lessons?.length || 1)) *
              100
            : 0;
        return (
          <div
            key={enroll._id?.toString()}
            className="flex lg:flex-row flex-col  mt-4 lg:rounded-lg p-2 overflow-hidden border-2  shadow-md font-bold  h-56 "
          >
            {/* image part */}
            <div className="w-96 h-full overflow-hidden ">
              <img
                className="w-full rounded-md h-full "
                src={enroll.courseId.courseThumbnailUrl} // Use appropriate enrollment property
                alt="Course"
              />
            </div>
            {/* right side contents */}
            <div className="w-full p-2 flex flex-col justify-between gap-2">
              <div>{enroll.courseId.courseName}</div>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <Book className="w-4" />
                  Lessons-{enroll.courseId.lessons?.length || 1}
                </div>
                <div className="flex gap-1">
                  <User className="w-4" />
                  Students-{enroll.courseId.studentCount || 10}
                </div>
                <div className="flex gap-1">
                  <Trophy className="w-4" />
                  medium
                </div>
              </div>
              <div>
                <div>
                  <Progress
                    value={progressPercentage}
                    className="rounded-full h-1"
                  />
                </div>
              </div>
              {/* footer */}
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <img
                      className="size-10 rounded"
                      src={enroll.courseId.courseThumbnailUrl} // Use appropriate enrollment property
                      alt="Instructor"
                    />
                  </div>
                  <div>
                    <div>{mentorName}</div>
                    <div>SEO</div>
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() =>
                      navigate(`/student/enrollments/${enroll._id}`)
                    }
                    className=" flex gap-3 bg-black hover:bg-green-500"
                  >
                    let &apos;s Go <ChevronRight />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EnrollmentCourseCard;
