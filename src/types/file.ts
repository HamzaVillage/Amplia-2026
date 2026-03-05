import { Document, Types } from "mongoose";
import { FileStatus } from "../constants/roles";

export interface IFile extends Document {
    name: string;
    year: number;
    url: string;
    status: FileStatus;
    type: "user_doc" | "return_doc";
    rejectionReason?: string;
    booking?: Types.ObjectId;
    uploadedBy?: Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}