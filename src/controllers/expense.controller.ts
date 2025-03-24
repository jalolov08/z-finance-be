import { Request, Response } from "express";
import { validateFields } from "../middlewares/validation.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { userService } from "../services/user.service";
import { expenseService } from "../services/expense.service";

export const createExpense = [
  validateFields(["name"]),
  asyncHandler(async (req: Request, res: Response) => {
    const name = req.body.name;
    const userId = req.user._id;

    const user = await userService.getUser(userId);

    const expense = await expenseService.createExpense(name, user);

    res.status(201).json({
      expense,
      messsage: "Расход успешно создан.",
    });
  }),
];
export const updateExpense = [
  validateFields(["name"]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const name = req.body.name;

    const updatedExpense = await expenseService.updateExpense(id, name);

    res.status(200).json({
      expense: updatedExpense,
      messsage: "Расход успешно обновлен.",
    });
  }),
];
export const getExpenses = [
  asyncHandler(async (req: Request, res: Response) => {
    const expenses = await expenseService.getExpenses();

    res.status(200).json(expenses);
  }),
];
export const deleteExpense = [
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    await expenseService.deleteExpense(id);

    res.status(200).json({
      messsage: "Расход успешно удален.",
    });
  }),
];
