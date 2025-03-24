import { Schema, model } from "mongoose";
import { IExpense } from "../types/expense.type";
import dayjs from "dayjs";

const ExpenseSchema = new Schema<IExpense>(
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

export const Expense = model<IExpense>("Expense", ExpenseSchema);
