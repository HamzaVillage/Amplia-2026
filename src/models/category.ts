import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types";

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    cover: { type: String },
}, { timestamps: true });

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
