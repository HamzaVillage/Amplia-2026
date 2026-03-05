import mongoose, { Query, Schema } from "mongoose";
import { FileStatus } from "../constants/roles";
import { IFile } from "../types";

const FileSchema = new Schema<IFile>({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    url: { type: String, required: true },
    status: { type: String, enum: Object.values(FileStatus), default: FileStatus.PENDING },
    type: { type: String, enum: ["user_doc", "return_doc"], default: "user_doc" },
    rejectionReason: { type: String, default: "" },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", default: null },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

FileSchema.pre<Query<IFile & { isDeleted: boolean; deletedAt?: Date }, IFile>>(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});

export const File = mongoose.model<IFile>("File", FileSchema);