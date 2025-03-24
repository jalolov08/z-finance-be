import { Schema, model } from "mongoose";
import { ICashbox } from "../types/cashbox.type";
import { Currency } from "../types/currency.type";

const CashboxSchema = new Schema<ICashbox>(
  {
    name: {
      type: String,
      required: true,
    },
    balance: {
      type: Schema.Types.Decimal128,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      enum: Object.values(Currency),
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Cashbox = model<ICashbox>("Cashbox", CashboxSchema);
