import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  createCashbox,
  getCashboxes,
  updateCashbox,
} from "../controllers/cashbox.controller";

export const cashboxRouter = Router();

cashboxRouter.post("/", authenticate, createCashbox);
cashboxRouter.put("/:id", authenticate, updateCashbox);
cashboxRouter.get("/", authenticate, getCashboxes);
