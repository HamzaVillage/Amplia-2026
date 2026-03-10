import mongoose, { Query, Schema } from "mongoose";
import { BookingStatus } from "../constants/roles";
import { IBooking } from "../types";

const BookingSchema = new Schema<IBooking>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    service: {
        _id: { type: Schema.Types.ObjectId, ref: "Service", required: true },
        name: String,
        category: String,
        description: String,
        cover: String,
        plan: {
            name: String,
            price: Number,
            description: String,
        }
    },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.NEW },
    filedFiles: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        year: { type: Number, required: true },
        status: { type: String, enum: ["pending", "sent", "received", "rejected"], default: "sent" },
        rejectionReason: { type: String },
        type: { type: String, enum: ["user_doc", "return_doc"], default: "user_doc" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }],
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    rating: { type: Schema.Types.ObjectId, ref: "Rating", default: null },
    year: { type: String, index: true },
    FiledYear: { type: Number, index: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

BookingSchema.pre<Query<IBooking & { isDeleted: boolean; deletedAt?: Date }, IBooking>>(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
