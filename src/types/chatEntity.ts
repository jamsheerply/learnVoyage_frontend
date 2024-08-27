import { Document, Types } from "mongoose";

export interface chatEntity extends Document {
  _id?: Types.ObjectId | string;
  chatName?: string;
  isGroupChat: boolean;
  users: Types.ObjectId[] | string;
  latestMessage?: Types.ObjectId | string;
  groupAdmin?: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}
