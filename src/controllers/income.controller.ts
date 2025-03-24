import { Request, Response } from "express";
import { validateFields } from "../middlewares/validation.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { userService } from "../services/user.service";
import { incomeService } from "../services/income.service";

export const createIncome = [
  validateFields(["name"]),
  asyncHandler(async (req: Request, res: Response) => {
    const name = req.body.name;
    const userId = req.user._id;

    const user = await userService.getUser(userId);

    const income = await incomeService.createIncome(name, user);

    res.status(201).json({
      income,
      messsage: "Приход успешно создан.",
    });
  }),
];
export const updateIncome = [
  validateFields(["name"]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const name = req.body.name;

    const updatedIncome = await incomeService.updateIncome(id, name);

    res.status(200).json({
      income: updatedIncome,
      messsage: "Приход успешно обновлен.",
    });
  }),
];
export const getIncomes = [
  asyncHandler(async (req: Request, res: Response) => {
    const incomes = await incomeService.getIncomes();

    res.status(200).json(incomes);
  }),
];
export const deleteIncome = [
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    await incomeService.deleteIncome(id);

    res.status(200).json({
      messsage: "Приход успешно удален.",
    });
  }),
];
