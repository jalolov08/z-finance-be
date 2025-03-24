import { Document, Types } from "mongoose";

export interface IIncome extends Document {
  name: string;
  ownerId: Types.ObjectId;
  ownerName: string;
  date: string;
}
