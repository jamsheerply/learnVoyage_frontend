import { Types, Document } from "mongoose";

export interface userEntity extends Document {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  pic: string;
  createdAt?: Date;
  updatedAt?: Date;
}
