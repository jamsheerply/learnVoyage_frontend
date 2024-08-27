import { Types } from "mongoose";

export interface AssessmentEntity {
  _id?: Types.ObjectId;
  instructorId: Types.ObjectId;
  courseId: Types.ObjectId;
  questions: {
    question: string;
    answer: string;
    options: string[];
    // options: {
    //   // 1: string;
    //   // 2: string;
    //   // 3: string;
    //   // 4: string;
    // };
  }[];
  maximumTime: number;
  passingPercentage: number;
}
