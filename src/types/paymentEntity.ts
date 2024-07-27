import { Types } from "mongoose";

export interface paymentEntity {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  method: string;
  status: string;
  amount: number;
  createdAt?: Date | string;
}
