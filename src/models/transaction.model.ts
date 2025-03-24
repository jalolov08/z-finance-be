import { Schema, model } from "mongoose";
import { ITransaction, TransactionType } from "../types/transaction.type";
import { Currency } from "../types/currency.type";
import dayjs from "dayjs";

const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(TransactionType),
    },
    date: {
      type: String,
      default: () => dayjs().format("DD.MM.YYYY HH:mm"),
    },
    cashboxId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Cashbox",
    },
    cashboxName: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      enum: Object.values(Currency),
    },
    USD_to_RUB: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    USD_to_CNY: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    amount: {
      USD: {
        type: Schema.Types.Decimal128,
        required: true,
      },
      RUB: {
        type: Schema.Types.Decimal128,
        required: true,
      },
      CNY: {
        type: Schema.Types.Decimal128,
        required: true,
      },
    },
    expenseId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Expense",
    },
    expenseName: {
      type: String,
      required: false,
    },
    incomeId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Income",
    },
    incomeName: {
      type: String,
      required: false,
    },
    balanceBefore: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    balanceAfter: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ownerName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  TransactionSchema
);
