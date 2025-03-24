import { Request, Response } from "express";
import { validateFields } from "../middlewares/validation.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { userService } from "../services/user.service";
import { cashboxService } from "../services/cashbox.service";

export const createCashbox = [
  validateFields(["name", "currency"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, currency } = req.body;
    const userId = req.user._id;

    const user = await userService.getUser(userId);

    const cashbox = await cashboxService.createCashbox(name, currency, user);

    res.status(201).json({
      cashbox,
      messsage: "Касса успешно создана.",
    });
  }),
];
export const updateCashbox = [
  validateFields(["name"]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const name = req.body.name;

    const updatedCashbox = await cashboxService.updateCashbox(id, name);

    res.status(201).json({
      cashbox: updatedCashbox,
      messsage: "Касса успешно обновлена.",
    });
  }),
];
export const getCashboxes = [
  asyncHandler(async (req: Request, res: Response) => {
    const cashboxes = await cashboxService.getCashboxes();

    res.status(200).json(cashboxes);
  }),
];
