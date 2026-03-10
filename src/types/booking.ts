import { Types } from "mongoose";
import { Document } from "mongoose";
import { BookingStatus } from "../constants/roles";

export interface IBookedServicePlan {
    name: string;
    price: number;
    description?: string;
}

export interface IBookedService {
    _id: Types.ObjectId;
    name: string;
    category: string;
    description: string;
    cover: string;
    plan: IBookedServicePlan;
}

export interface IFileSubDoc {
    _id: Types.ObjectId;
    name: string;
    url: string;
    year: number;
    status: BookingStatus;
    rejectionReason?: string;
    type: "user_doc" | "return_doc";
    createdAt: Date;
    updatedAt: Date;
}

export interface IBooking extends Document {
    user: Types.ObjectId;
    service: IBookedService;
    status: BookingStatus;
    assignedTo?: Types.ObjectId;
    startDate?: Date;
    endDate?: Date;
    rating?: Types.ObjectId;
    year: string;
    FiledYear: number;
    filedFiles: IFileSubDoc[];
    isDeleted: boolean;
    deletedAt?: Date;
}