import dayjs from "dayjs";
import { CurrencyRates } from "../models/currencyRates.model";
import { InternalServerError, NotFoundError } from "../utils/errors";
import { Decimal128, Types } from "mongoose";

class CurrencyRatesService {
  async getCurrencyRates() {
    try {
      const currencyRates = await CurrencyRates.findOne();

      if (!currencyRates) {
        throw new NotFoundError("Курсы валют не найдены.");
      }

      return currencyRates;
    } catch (error) {
      console.error("Ошибка при курсов валют", error);
      throw new InternalServerError("Ошибка при курсов валют.");
    }
  }
  async updateCurrencyRates(USD_to_RUB: number, USD_to_CNY: number) {
    try {
      const existingRates = await CurrencyRates.findOne();

      if (existingRates) {
        existingRates.USD_to_RUB = Types.Decimal128.fromString(
          USD_to_RUB.toString()
        );
        existingRates.USD_to_CNY = Types.Decimal128.fromString(
          USD_to_CNY.toString()
        );
        existingRates.lastUpdate = dayjs().format("DD.MM.YYYY HH:mm");
        await existingRates.save();

        return existingRates;
      } else {
        const newCurrencyRates = new CurrencyRates({
          USD_to_RUB: Types.Decimal128.fromString(USD_to_RUB.toString()),
          USD_to_CNY: Types.Decimal128.fromString(USD_to_CNY.toString()),
        });
        await newCurrencyRates.save();

        return newCurrencyRates;
      }
    } catch (error) {
      console.error("Ошибка сохранения курсов валют", error);
      throw new InternalServerError("Ошибка сохранения курсов валют.");
    }
  }
}

export const currencyRatesService = new CurrencyRatesService();
