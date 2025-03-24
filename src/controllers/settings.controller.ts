import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { currencyRatesService } from "../services/currencyRates.service";
import { validateFields } from "../middlewares/validation.middleware";

export const getCurrencyRates = [
  asyncHandler(async (req: Request, res: Response) => {
    const currencyRates = await currencyRatesService.getCurrencyRates();

    res.status(200).json(currencyRates);
  }),
];
export const updateCurrencyRates = [
  validateFields(["USD_to_RUB", "USD_to_CNY"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { USD_to_RUB, USD_to_CNY } = req.body;

    const updateCurrencyRates = await currencyRatesService.updateCurrencyRates(
      USD_to_RUB,
      USD_to_CNY
    );

    res.status(200).json(updateCurrencyRates);
  }),
];
