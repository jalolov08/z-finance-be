import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expense.controller";

export const expenseRouter = Router();

expenseRouter.post("/", authenticate, createExpense);
expenseRouter.put("/:id", authenticate, updateExpense);
expenseRouter.get("/", authenticate, getExpenses);
expenseRouter.delete("/:id", authenticate, deleteExpense);
