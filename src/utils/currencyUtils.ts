import { Types } from "mongoose";
import { ICurrencyRates } from "../types/currencyRates.type";
import { Currency } from "../types/currency.type";

export const convertAmount = (
  amount: number,
  currency: Currency,
  currencyRates: ICurrencyRates
): { USD: number; CNY: number; RUB: number } => {
  let amounts: { USD: number; CNY: number; RUB: number } = {
    USD: 0,
    CNY: 0,
    RUB: 0,
  };

  if (currency === Currency.USD) {
    amounts.USD = amount;
    amounts.CNY = amount * parseFloat(currencyRates.USD_to_CNY.toString());
    amounts.RUB = amount * parseFloat(currencyRates.USD_to_RUB.toString());
  } else if (currency === Currency.CNY) {
    amounts.CNY = amount;
    amounts.USD = amount / parseFloat(currencyRates.USD_to_CNY.toString());
    amounts.RUB = amounts.USD * parseFloat(currencyRates.USD_to_RUB.toString());
  } else if (currency === Currency.RUB) {
    amounts.RUB = amount;
    amounts.USD = amount / parseFloat(currencyRates.USD_to_RUB.toString());
    amounts.CNY = amounts.USD * parseFloat(currencyRates.USD_to_CNY.toString());
  }

  return amounts;
};

export const toDecimal128 = (amount: number): Types.Decimal128 => {
  return Types.Decimal128.fromString(amount.toString());
};
