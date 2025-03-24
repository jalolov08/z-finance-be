import { Request, Response } from "express";
import { validateFields } from "../middlewares/validation.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { userService } from "../services/user.service";
import { transactionService } from "../services/transaction.service";
import { currencyRatesService } from "../services/currencyRates.service";
import { BadRequestError } from "../utils/errors";
import { Currency } from "../types/currency.type";
import { TransactionType } from "../types/transaction.type";
import { expenseService } from "../services/expense.service";
import { incomeService } from "../services/income.service";

export const createTransaction = [
  validateFields(["type", "cashboxId", "currency", "amount", "description"]),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      type,
      cashboxId,
      currency,
      amount,
      description,
      expenseId,
      incomeId,
    } = req.body;
    const userId = req.user._id;

    if (!Object.values(Currency).includes(currency)) {
      throw new BadRequestError("Неверный тип валюты.");
    }

    if (type === TransactionType.EXPENSE && !expenseId) {
      throw new BadRequestError("Для расхода необходимо указать expenseId.");
    }

    if (type === TransactionType.INCOME && !incomeId) {
      throw new BadRequestError("Для прихода необходимо указать incomeId.");
    }

    let expense;
    let income;

    if (type === TransactionType.EXPENSE) {
      expense = await expenseService.getExpense(expenseId);
    }

    if (type === TransactionType.INCOME) {
      income = await incomeService.getIncome(incomeId);
    }

    const user = await userService.getUser(userId);
    const currencyRates = await currencyRatesService.getCurrencyRates();
    const transaction = await transactionService.createTransaction(
      cashboxId,
      type,
      currency,
      currencyRates,
      amount,
      description,
      user,
      expense,
      income
    );

    res
      .status(200)
      .json({ transaction, message: "Транзакция успешно создана." });
  }),
];
export const deleteTransaction = [
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    await transactionService.deleteTransaction(id);

    res.status(200).json({
      messsage: "Транзакция успешно удалена.",
    });
  }),
];
export const getTransactions = [
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      pageSize = 10,
      cashboxId,
      type,
      incomeId,
      expenseId,
      startDate,
      endDate,
      search,
      currency,
    } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSizeNumber = parseInt(pageSize as string);

    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new BadRequestError("Invalid page number.");
    }
    if (isNaN(pageSizeNumber) || pageSizeNumber < 1) {
      throw new BadRequestError("Invalid page size.");
    }

    const filters = {
      page: pageNumber,
      pageSize: pageSizeNumber,
      cashboxId: cashboxId as string,
      type: type as TransactionType,
      incomeId: incomeId as string,
      expenseId: expenseId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      search: search as string,
      currency: currency as Currency,
    };

    const result = await transactionService.getTransactions(filters);

    res.status(200).json(result);
  }),
];
