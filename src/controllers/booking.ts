import { Request, Response } from "express";
import mongoose from "mongoose";
import { Booking } from "../models/booking";
import { BookingStatus } from "../constants/roles";

export const BookingController = {
    create: async (req: Request, res: Response) => {
        try {
            const _id = req._id
            const { service, serviceName, category, planName, price, description, cover, startDate, endDate, status } = req.body;

            const booking = await Booking.create({
                user: _id,
                service: {
                    _id: service,
                    name: serviceName,
                    category: category || 'Unknown',
                    description: description || "",
                    cover: cover || "",
                    plan: {
                        name: planName,
                        price: price || 0,
                        description: description || ""
                    },
                },
                status: status || 'new',
                startDate: startDate || new Date(),
                endDate: endDate || startDate || new Date(),
            });
            res.status(200).json({ success: true, message: 'Your booking is confirmed.', booking })

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    updateStatus: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const booking = await Booking.findById(id);
            if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

            // Permission check: admins can update any, users can only update their own
            // @ts-ignore
            if (req.role === "user") {
                // @ts-ignore
                if (booking.user.toString() !== req._id.toString()) {
                    return res.status(403).json({ success: false, message: "You can only update your own booking." });
                }
            } else if (req.role === "subAdmin") {
                // @ts-ignore
                const subAdminId = req._id.toString();
                const assignedId = booking.assignedTo?.toString();
                if (assignedId !== subAdminId) {
                    return res.status(403).json({ success: false, message: "You can only update bookings assigned to you." });
                }
            }

            // Basic workflow validations
            const currentStatus = booking.status;

            // Optional: Enforce sequence for filing workflow
            // Note: We keep it somewhat flexible but handle specific logic for 'review'
            if (status === BookingStatus.REVIEW) {
                // Check if a 'return_doc' exists for this booking in embedded files
                const hasReturnDoc = booking.filedFiles.some(f => f.type === "return_doc");
                if (!hasReturnDoc) {
                    return res.status(400).json({
                        success: false,
                        message: "Cannot move to review without an uploaded Return document."
                    });
                }
            }

            // If moving to 'FILED', we eventually want to reset to 'NEW' as per user request
            // But 'FILED' is a valid intermediate state for admin completion

            booking.status = status
            await booking.save();

            // After save, if status is 'FILED', admin might click 'Complete' later
            // The user said: "admmin press on the bitton filed completed and the house will go to again to the inital screen"
            // We'll handle the reset in a separate 'complete' or just here if status is 'new'

            res.status(200).json({
                success: true, message: `Booking status updated to ${status}.`, booking
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const booking = await Booking.findById(id);
            if (!booking || booking.isDeleted) {
                return res.status(404).json({ success: false, message: "Booking not found" });
            }

            booking.isDeleted = true;
            booking.deletedAt = new Date();
            await booking.save();

            res.status(200).json({ success: true, message: "Booking deleted successfully." });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    assign: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const subAdminId = new mongoose.Types.ObjectId(req._id); // Assign to self (current logged in user)

            const booking = await Booking.findById(id);
            if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

            if (booking.assignedTo) {
                return res.status(400).json({ success: false, message: "Booking is already assigned to someone." });
            }

            booking.assignedTo = subAdminId;

            // Logic to update status based on start date
            const now = new Date();
            const startDate = booking.startDate || now;

            if (startDate > now) {
                booking.status = BookingStatus.SCHEDULED;
            } else {
                booking.status = BookingStatus.ACTIVE;
            }

            await booking.save();

            // Populate assignedTo for the response
            await booking.populate('assignedTo', 'firstName lastName email');

            res.status(200).json({
                success: true, message: "Booking assigned successfully.", booking
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    getBooking: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { user, status, service, search } = req.query;

            if (id) {
                const booking = await Booking.findById(id)
                    .populate('assignedTo', 'firstName lastName email profile')
                    .populate('user', 'firstName lastName email profile');
                if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

                return res.status(200).json({ success: true, message: "Booking retrieved successfully.", booking });
            }

            const query: any = {};

            if (user) query.user = user;
            if (status) query.status = status;
            if (service) query['service._id'] = service;
            if (search) query['service.name'] = { $regex: search, $options: 'i' };

            const bookings = await Booking.find(query)
                .populate('assignedTo', 'firstName lastName email profile')
                .populate('user', 'firstName lastName email profile')
                .sort({ createdAt: -1 });
            return res.status(200).json({ success: true, message: "All bookings retrieved successfully.", bookings });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    }
}