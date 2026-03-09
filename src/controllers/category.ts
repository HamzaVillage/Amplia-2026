import { Request, Response } from "express";
import { Category } from "../models/category";

export const CategoryController = {
    get: async (req: Request, res: Response) => {
        try {
            const categories = await Category.find();
            res.status(200).json({ success: true, data: categories, count: categories.length });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
};
