import { Cashbox } from "../models/cashobx.model";
import { Currency } from "../types/currency.type";
import { IUser } from "../types/user.type";
import { InternalServerError, NotFoundError } from "../utils/errors";

class CashboxService {
  async createCashbox(name: string, currency: Currency, user: IUser) {
    const newCashbox = new Cashbox({
      name,
      currency,
      ownerId: user._id,
      ownerName: user.name,
    });

    try {
      await newCashbox.save();

      return newCashbox;
    } catch (error) {
      console.error("Ошибка при создание кассы", error);
      throw new InternalServerError("Ошибка при создание кассы.");
    }
  }

  async updateCashbox(cashboxId: string, name: string) {
    try {
      const updatedCashbox = await Cashbox.findByIdAndUpdate(
        cashboxId,
        {
          name,
        },
        { new: true }
      );

      if (!updatedCashbox) {
        throw new NotFoundError("Касса не найдена.");
      }

      return updatedCashbox;
    } catch (error) {
      console.error("Ошибка при обновлении кассы", error);
      throw new InternalServerError("Ошибка при обновлении кассы.");
    }
  }

  async getCashbox(id: string) {
    try {
      const cashbox = await Cashbox.findById(id);

      if (!cashbox) {
        throw new NotFoundError("Касса не найдена.");
      }

      return cashbox;
    } catch (error) {
      console.error("Ошибка при получение кассы", error);
      throw new InternalServerError("Ошибка при получение кассы.");
    }
  }

  async getCashboxes() {
    try {
      const cashboxes = await Cashbox.find();

      return cashboxes;
    } catch (error) {
      console.error("Ошибка при получении касс:", error);
      throw new InternalServerError("Ошибка при получении касс.");
    }
  }
}

export const cashboxService = new CashboxService();
