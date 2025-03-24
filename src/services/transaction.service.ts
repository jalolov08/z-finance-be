import { SortOrder, startSession, Types } from "mongoose";
import { Currency } from "../types/currency.type";
import { ICurrencyRates } from "../types/currencyRates.type";
import { IExpense } from "../types/expense.type";
import { IIncome } from "../types/income.type";
import { TransactionType } from "../types/transaction.type";
import { IUser } from "../types/user.type";
import { cashboxService } from "./cashbox.service";
import { BadRequestError, InternalServerError } from "../utils/errors";
import { Transaction } from "../models/transaction.model";
import { convertAmount, toDecimal128 } from "../utils/currencyUtils";

class TransactionService {
  async createTransaction(
    cashboxId: string,
    type: TransactionType,
    currency: Currency,
    currencyRates: ICurrencyRates,
    amount: number,
    description: string,
    user: IUser,
    expense?: IExpense,
    income?: IIncome
  ) {
    const session = await startSession();
    session.startTransaction();
    try {
      const cashbox = await cashboxService.getCashbox(cashboxId, session);
      const amounts = convertAmount(amount, currency, currencyRates);
      const balanceBefore = cashbox.balance;

      if (type === TransactionType.EXPENSE) {
        if (!expense) {
          throw new BadRequestError("Выберете элемент для расхода.");
        }

        if (
          parseFloat(cashbox.balance.toString()) < amounts[cashbox.currency]
        ) {
          throw new BadRequestError("Недостаточно средств на кассе.");
        }

        cashbox.balance = toDecimal128(
          parseFloat(cashbox.balance.toString()) - amounts[cashbox.currency]
        );
      } else if (type === TransactionType.INCOME) {
        if (!income) {
          throw new BadRequestError("Выберете элемент для прихода.");
        }

        cashbox.balance = toDecimal128(
          parseFloat(cashbox.balance.toString()) + amounts[cashbox.currency]
        );
      }

      await cashbox.save({ session });

      const balanceAfter = cashbox.balance;

      const newTransaction = new Transaction({
        type,
        cashboxId,
        cashboxName: cashbox.name,
        currency,
        USD_to_RUB: currencyRates.USD_to_RUB,
        USD_to_CNY: currencyRates.USD_to_CNY,
        amount: amounts,
        balanceBefore,
        balanceAfter,
        description,
        ownerId: user._id,
        ownerName: user.name,
        incomeId: income?._id,
        incomeName: income?.name,
        expenseId: expense?._id,
        expenseName: expense?.name,
      });

      await newTransaction.save({ session });

      await session.commitTransaction();
      session.endSession();
      return newTransaction;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof BadRequestError) {
        throw error;
      }
      console.error("Ошибка при создание транзакции", error);
      throw new InternalServerError("Ошибка при создание транзакции.");
    }
  }

  async deleteTransaction(transactionId: string) {
    const session = await startSession();
    session.startTransaction();
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new BadRequestError("Транзакция не найдена.");
      }

      const cashbox = await cashboxService.getCashbox(
        transaction.cashboxId.toString(),
        session
      );

      let amountToReverse = transaction.amount[cashbox.currency];

      if (transaction.type === TransactionType.EXPENSE) {
        cashbox.balance = toDecimal128(
          parseFloat(cashbox.balance.toString()) +
            parseFloat(amountToReverse.toString())
        );
      } else if (transaction.type === TransactionType.INCOME) {
        cashbox.balance = toDecimal128(
          parseFloat(cashbox.balance.toString()) -
            parseFloat(amountToReverse.toString())
        );
      }

      await cashbox.save({ session });

      await transaction.deleteOne({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        message: "Транзакция успешно удалена и сумма возвращена в кассу.",
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof BadRequestError) {
        throw error;
      }
      console.error("Ошибка при удалении транзакции", error);
      throw new InternalServerError("Ошибка при удалении транзакции.");
    }
  }

  async getTransactions(filters: {
    cashboxId?: string;
    type?: TransactionType;
    incomeId?: string;
    expenseId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
    currency?: Currency;
    search?: string;
  }) {
    const session = await startSession();
    session.startTransaction();
    try {
      const query: any = {};
      if (filters.cashboxId) {
        query.cashboxId = filters.cashboxId;
      }
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.incomeId) {
        query.ownerId = filters.incomeId;
      }
      if (filters.expenseId) {
        query.ownerId = filters.expenseId;
      }
      if (filters.startDate) {
        query.createdAt = { $gte: filters.startDate };
      }
      if (filters.endDate) {
        query.createdAt = { ...query.createdAt, $lte: filters.endDate };
      }
      if (filters.search) {
        query.$or = [
          { description: { $regex: filters.search, $options: "i" } },
          { expenseName: { $regex: filters.search, $options: "i" } },
          { incomeName: { $regex: filters.search, $options: "i" } },
        ];
      }

      const page = filters.page || 1;
      const pageSize = filters.pageSize || 10;
      const skip = (page - 1) * pageSize;

      const sort: { [key: string]: SortOrder } = { createdAt: -1 };

      const transactions = await Transaction.find(query)
        .skip(skip)
        .limit(pageSize)
        .sort(sort)
        .session(session);

      const totalTransactions = await Transaction.countDocuments(query).session(
        session
      );

      await session.commitTransaction();
      session.endSession();

      return {
        transactions,
        total: totalTransactions,
        pages: Math.ceil(totalTransactions / pageSize),
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Ошибка при получении транзакций", error);
      throw new InternalServerError("Ошибка при получении транзакций.");
    }
  }
}

export const transactionService = new TransactionService();
