import { Document, Types } from "mongoose";

export interface ICurrencyRates extends Document {
  USD_to_RUB: Types.Decimal128;
  USD_to_TJS: Types.Decimal128;
  lastUpdate: string;
}
