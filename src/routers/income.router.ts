import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  createIncome,
  deleteIncome,
  getIncomes,
  updateIncome,
} from "../controllers/income.controller";

export const incomeRouter = Router();

incomeRouter.post("/", authenticate, createIncome);
incomeRouter.put("/:id", authenticate, updateIncome);
incomeRouter.get("/", authenticate, getIncomes);
incomeRouter.delete("/:id", authenticate, deleteIncome);
