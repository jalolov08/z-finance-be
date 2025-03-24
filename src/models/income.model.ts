import { Schema, model } from "mongoose";
import { IIncome } from "../types/income.type";
import dayjs from "dayjs";

const IncomeSchema = new Schema<IIncome>(
  {
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: () => dayjs().format("DD.MM.YYYY HH:mm"),
    },
  },
  { timestamps: true }
);

export const Income = model<IIncome>("Income", IncomeSchema);
