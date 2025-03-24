import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
} from "../controllers/transaction.controller";

export const transactionRouter = Router();

transactionRouter.post("/", authenticate, createTransaction);
transactionRouter.delete("/:id", authenticate, deleteTransaction);
transactionRouter.get("/", authenticate, getTransactions);
