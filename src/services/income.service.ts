import { Income } from "../models/income.model";
import { IUser } from "../types/user.type";
import { InternalServerError, NotFoundError } from "../utils/errors";

class IncomeService {
  async createIncome(name: string, user: IUser) {
    const newIncome = new Income({
      name,
      ownerId: user._id,
      ownerName: user.name,
    });

    try {
      await newIncome.save();

      return newIncome;
    } catch (error) {
      console.error("Ошибка при создание прихода", error);
      throw new InternalServerError("Ошибка при создание прихода.");
    }
  }

  async updateIncome(id: string, name: string) {
    try {
      const updatedIncome = await Income.findByIdAndUpdate(
        id,
        {
          name,
        },
        { new: true }
      );

      if (!updatedIncome) {
        throw new NotFoundError("Приход не найден.");
      }

      return updatedIncome;
    } catch (error) {
      console.error("Ошибка при обновлении прихода", error);
      throw new InternalServerError("Ошибка при обновлении прихода.");
    }
  }

  async getIncome(id: string) {
    try {
      const income = await Income.findById(id);

      if (!income) {
        throw new NotFoundError("Приход не найден.");
      }

      return income;
    } catch (error) {
      console.error("Ошибка при получение прихода", error);
      throw new InternalServerError("Ошибка при получение прихода.");
    }
  }

  async getIncomes() {
    try {
      const incomes = await Income.find();

      return incomes;
    } catch (error) {
      console.error("Ошибка при получении приходов:", error);
      throw new InternalServerError("Ошибка при получении приходов.");
    }
  }

  async deleteIncome(id: string) {
    try {
      const deletedIncome = await Income.findByIdAndDelete(id);

      if (!deletedIncome) {
        throw new NotFoundError("Приход не найден.");
      }

      return deletedIncome;
    } catch (error) {
      console.error("Ошибка при удалении прихода", error);
      throw new InternalServerError("Ошибка при удалении прихода.");
    }
  }
}

export const incomeService = new IncomeService();
