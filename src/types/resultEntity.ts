import { Types } from "mongoose";

export interface ResultEntity {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  assessmentId: Types.ObjectId | string;
  status: "completed" | "failed" | "pending";
  score: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
