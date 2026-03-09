import { Request, Response } from "express";
import { Service } from "../models/service";

export const ServiceController = {
    get: async (req: Request, res: Response) => {
        try {
            const { categoryId, search } = req.query;
            const query: any = { isDeleted: false };
            if (categoryId) query.category = categoryId;
            if (search) query.name = { $regex: search, $options: 'i' };

            const services = await Service.find(query).populate('category');
            res.status(200).json({ success: true, services, count: services.length });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const service = await Service.findById(req.params.id).populate('category');
            if (!service) return res.status(404).json({ success: false, message: "Service not found" });
            res.status(200).json({ success: true, data: service });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    }
};
