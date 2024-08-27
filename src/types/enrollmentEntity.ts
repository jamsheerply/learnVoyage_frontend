import { Types } from "mongoose";
import { ICourse } from "./course.entity";

export interface EnrollmentEntity {
  _id?: Types.ObjectId;
  userId: string;
  courseId: Types.ObjectId;
  enrolledAt?: Date | string;
  progress?: {
    completedLessons?: Types.ObjectId[] | [] | null;
    completedAssessments?: Types.ObjectId[] | [] | null;
  };
}

export interface ExtendedEnrollmentEntity extends EnrollmentEntity {
  course: ICourse;
  progress?: {
    completedLessons?: Types.ObjectId[] | [] | null;
  };
}
