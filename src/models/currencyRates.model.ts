import { Schema, model } from "mongoose";
import { ICurrencyRates } from "../types/currencyRates.type";
import dayjs from "dayjs";

const CurrencyRatesSchema = new Schema<ICurrencyRates>(
  {
    USD_to_RUB: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    USD_to_TJS: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    lastUpdate: {
      type: String,
      default: () => dayjs().format("DD.MM.YYYY HH:mm"),
    },
  },
  { timestamps: true }
);

export const CurrencyRates = model<ICurrencyRates>(
  "CurrencyRates",
  CurrencyRatesSchema
);
