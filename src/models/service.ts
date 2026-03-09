import mongoose, { Schema } from "mongoose";
import { IService } from "../types";

const ServiceSchema = new Schema<IService>({
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String },
    cover: { type: String },
    price: { type: Number, required: true },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    features: [{ type: String }],
    plans: { type: String, default: 'standard' },
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

export const Service = mongoose.model<IService>("Service", ServiceSchema);
