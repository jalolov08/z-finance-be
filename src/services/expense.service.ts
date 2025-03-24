import { Expense } from "../models/expense.model";
import { IUser } from "../types/user.type";
import { InternalServerError, NotFoundError } from "../utils/errors";

class ExpenseService {
  async createExpense(name: string, user: IUser) {
    const newExpense = new Expense({
      name,
      ownerId: user._id,
      ownerName: user.name,
    });

    try {
      await newExpense.save();

      return newExpense;
    } catch (error) {
      console.error("Ошибка при создание расхода", error);
      throw new InternalServerError("Ошибка при создание прихода.");
    }
  }

  async updateExpense(id: string, name: string) {
    try {
      const updatedExpense = await Expense.findByIdAndUpdate(
        id,
        {
          name,
        },
        { new: true }
      );

      if (!updatedExpense) {
        throw new NotFoundError("Расход не найден.");
      }

      return updatedExpense;
    } catch (error) {
      console.error("Ошибка при обновлении расхода", error);
      throw new InternalServerError("Ошибка при обновлении расхода.");
    }
  }

  async getExpense(id: string) {
    try {
      const expense = await Expense.findById(id);

      if (!expense) {
        throw new NotFoundError("Расход не найден.");
      }

      return expense;
    } catch (error) {
      console.error("Ошибка при получение расхода", error);
      throw new InternalServerError("Ошибка при получение расхода.");
    }
  }

  async getExpenses() {
    try {
      const expenses = await Expense.find();

      return expenses;
    } catch (error) {
      console.error("Ошибка при получении расходов:", error);
      throw new InternalServerError("Ошибка при получении расходов.");
    }
  }

  async deleteExpense(id: string) {
    try {
      const deletedExpense = await Expense.findByIdAndDelete(id);

      if (!deletedExpense) {
        throw new NotFoundError("Расход не найден.");
      }

      return deletedExpense;
    } catch (error) {
      console.error("Ошибка при удалении расхода", error);
      throw new InternalServerError("Ошибка при удалении расхода.");
    }
  }
}

export const expenseService = new ExpenseService();
