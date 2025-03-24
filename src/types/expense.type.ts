import { Document, Types } from "mongoose";

export interface IExpense extends Document {
  name: string;
  ownerId: Types.ObjectId;
  ownerName: string;
  date: string;
}
