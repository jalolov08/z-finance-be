import { Router } from "express";
import { userRouter } from "./user.router";
import { settingsRouter } from "./settings.router";
import { cashboxRouter } from "./cashbox.router";
import { incomeRouter } from "./income.router";
import { expenseRouter } from "./expense.router";

export const router = Router();

router.use("/user", userRouter);
router.use("/settings", settingsRouter);
router.use("/cashbox", cashboxRouter);
router.use("/income", incomeRouter);
router.use("/expense", expenseRouter);
