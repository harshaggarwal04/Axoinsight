import { Schema, model, models, type Model } from "mongoose";

export interface PriceItem {
  symbol: string;
  price: number;
  change: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PriceSchema = new Schema<PriceItem>(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true },
    price: { type: Number, required: true },
    change: { type: Number, required: true },
  },
  { timestamps: true }
);

PriceSchema.index({ symbol: 1 });

export const Price: Model<PriceItem> =
  (models?.Price as Model<PriceItem>) || model<PriceItem>("Price", PriceSchema);