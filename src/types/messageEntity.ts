import { Document, Types } from "mongoose";

export interface messageEntity extends Document {
  _id?: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  chat: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
