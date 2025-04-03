import { Types } from "mongoose";
import { ICurrencyRates } from "../types/currencyRates.type";
import { Currency } from "../types/currency.type";

export const convertAmount = (
  amount: number,
  currency: Currency,
  currencyRates: ICurrencyRates
): { USD: number; TJS: number; RUB: number } => {
  let amounts: { USD: number; TJS: number; RUB: number } = {
    USD: 0,
    TJS: 0,
    RUB: 0,
  };

  if (currency === Currency.USD) {
    amounts.USD = amount;
    amounts.TJS = amount * parseFloat(currencyRates.USD_to_TJS.toString());
    amounts.RUB = amount * parseFloat(currencyRates.USD_to_RUB.toString());
  } else if (currency === Currency.TJS) {
    amounts.TJS = amount;
    amounts.USD = amount / parseFloat(currencyRates.USD_to_TJS.toString());
    amounts.RUB = amounts.USD * parseFloat(currencyRates.USD_to_RUB.toString());
  } else if (currency === Currency.RUB) {
    amounts.RUB = amount;
    amounts.USD = amount / parseFloat(currencyRates.USD_to_RUB.toString());
    amounts.TJS = amounts.USD * parseFloat(currencyRates.USD_to_TJS.toString());
  }

  return amounts;
};

export const toDecimal128 = (amount: number): Types.Decimal128 => {
  return Types.Decimal128.fromString(amount.toString());
};
