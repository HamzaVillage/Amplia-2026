import mongoose, { Schema } from "mongoose";
import { ITaxCategory } from "../types";

const TaxBracketSchema = new Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    rate: { type: Number, required: true },
    base: { type: Number, required: true },
}, { _id: false });

const TaxCategorySchema = new Schema<ITaxCategory>({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    rate: { type: Number, default: 0 },
    taxType: { type: String, required: true },
    filerStatus: { type: String, required: true },
    description: { type: String },
    brackets: [TaxBracketSchema],
}, { timestamps: true });

export const TaxCategory = mongoose.model<ITaxCategory>("TaxCategory", TaxCategorySchema);
