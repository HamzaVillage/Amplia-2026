import { Document } from "mongoose";

export interface ITaxBracket {
    min: number;
    max: number;
    rate: number;
    base: number;
}

export interface ITaxCategory extends Document {
    name: string;
    year: number;
    rate: number; // Default flat rate
    taxType: string; // e.g., Salary, Business
    filerStatus: string; // e.g., Filer, Non-Filer
    description?: string;
    brackets: ITaxBracket[]; // Progressive tax brackets
    createdAt?: Date;
    updatedAt?: Date;
}
