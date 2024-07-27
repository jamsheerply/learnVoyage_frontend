import { Types } from "mongoose";

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
