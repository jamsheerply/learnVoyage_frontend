import { Types, Document } from "mongoose";

export interface userChatEntity extends Document {
  _id?: Types.ObjectId | string;
  name: string;
  email: string;
  password?: string;
  pic: string;
  createdAt?: Date;
  updatedAt?: Date;
}
