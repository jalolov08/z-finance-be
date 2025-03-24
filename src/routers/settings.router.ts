import { Router } from "express";
import {
  getCurrencyRates,
  updateCurrencyRates,
} from "../controllers/settings.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

export const settingsRouter = Router();

settingsRouter.get("/currency-rates", authenticate, getCurrencyRates);
settingsRouter.post("/currency-rates", authenticate, updateCurrencyRates);
