import { Request, Response } from "express";
import { TaxCategory } from "../models/taxCategory";
import { ITaxBracket } from "../types";

export const taxCategoryController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const { year } = req.query;
            const query: any = {};
            if (year) query.year = parseInt(year as string);

            const categories = await TaxCategory.find(query).sort({ year: -1, name: 1 });
            res.status(200).json({ success: true, data: categories });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const category = new TaxCategory(req.body);
            await category.save();
            res.status(201).json({ success: true, data: category });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const category = await TaxCategory.findByIdAndUpdate(id, req.body, { new: true });
            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }
            res.status(200).json({ success: true, data: category });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const category = await TaxCategory.findByIdAndDelete(id);
            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }
            res.status(200).json({ success: true, message: "Category deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    calculate: async (req: Request, res: Response) => {
        try {
            const { categoryId, amount } = req.body;
            const category = await TaxCategory.findById(categoryId);

            if (!category) {
                return res.status(404).json({ success: false, message: "Tax category not found" });
            }

            let taxValue = 0;
            const taxableAmount = parseFloat(amount);
            let appliedRate = 0;

            if (category.brackets && category.brackets.length > 0) {
                // Progressive tax logic
                const sortedBrackets = [...category.brackets].sort((a, b) => a.min - b.min);
                const applicableBracket = sortedBrackets.reverse().find(b => taxableAmount >= b.min);

                if (applicableBracket) {
                    taxValue = applicableBracket.base + (taxableAmount - applicableBracket.min) * (applicableBracket.rate / 100);
                    appliedRate = applicableBracket.rate;
                }
            } else {
                // Flat rate logic
                taxValue = taxableAmount * (category.rate / 100);
                appliedRate = category.rate;
            }

            res.status(200).json({
                success: true,
                data: {
                    taxAmount: taxValue,
                    netAmount: taxableAmount - taxValue,
                    category: category.name,
                    year: category.year,
                    rate: appliedRate,
                    originalAmount: taxableAmount,
                    totalAmount: taxableAmount
                }
            });

        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
