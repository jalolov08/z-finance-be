import { Document, Types } from "mongoose";
import { Currency } from "./currency.type";

export enum TransactionType {
  INCOME = "Приход",
  EXPENSE = "Расход",
}

export interface ITransaction extends Document {
  type: TransactionType;
  date: string;
  cashboxId: Types.ObjectId;
  cashboxName: string;
  currency: Currency;
  USD_to_RUB: Types.Decimal128;
  USD_to_TJS: Types.Decimal128;
  amount: {
    USD: Types.Decimal128;
    RUB: Types.Decimal128;
    TJS: Types.Decimal128;
  };
  expenseId?: Types.ObjectId;
  expenseName?: string;
  incomeId?: Types.ObjectId;
  incomeName?: string;
  balanceBefore: Types.Decimal128;
  balanceAfter: Types.Decimal128;
  description: string;
  ownerId: Types.ObjectId;
  ownerName: string;
}
