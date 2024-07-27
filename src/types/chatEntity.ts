import { Document, Types } from "mongoose";

export interface chatEntity extends Document {
  _id?: Types.ObjectId;
  chatName?: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  latestMessage?: Types.ObjectId;
  groupAdmin?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
