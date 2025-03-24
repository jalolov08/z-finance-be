import { Document, Types } from "mongoose";
import { Currency } from "./currency.type";

export interface ICashbox extends Document {
  name: string;
  balance: Types.Decimal128;
  currency: Currency;
  ownerId: Types.ObjectId;
  ownerName: string;
}
