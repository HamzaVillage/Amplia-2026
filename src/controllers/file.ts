import { Request, Response } from "express";
import { Booking } from "../models/booking";
import { UserRole } from "../constants/roles";

interface IFileController {
    add: (req: Request, res: Response) => Promise<any>;
    update: (req: Request, res: Response) => Promise<any>;
    delete: (req: Request, res: Response) => Promise<any>;
    get: (req: Request, res: Response) => Promise<any>;
    link: (req: Request, res: Response) => Promise<any>;
}

export const FileController: IFileController = {
    add: async (req: Request, res: Response) => {
        try {
            const { name, year, bookingId, type } = req.body;
            if (!req.file) return res.status(400).json({ success: false, message: "File is required." });
            if (!bookingId) return res.status(400).json({ success: false, message: "Booking ID is required." });

            const booking = await Booking.findById(bookingId);
            if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

            const url = req.file.filename;

            const newFile = {
                name,
                year,
                url,
                type: type || "user_doc",
                status: "sent",
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // @ts-ignore
            booking.filedFiles.push(newFile);
            await booking.save();

            const addedFile = booking.filedFiles[booking.filedFiles.length - 1];

            res.status(201).json({
                success: true, message: "File uploaded successfully.", file: addedFile
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params; // The file _id
            const { status, rejectionReason } = req.body;

            // Find booking that contains this file
            const booking = await Booking.findOne({ "filedFiles._id": id });
            if (!booking) return res.status(404).json({ success: false, message: "File or Booking not found." });

            // @ts-ignore
            const file = booking.filedFiles.id(id);
            if (!file) return res.status(404).json({ success: false, message: "File not found." });

            if (status) file.status = status;
            if (rejectionReason !== undefined) file.rejectionReason = rejectionReason;
            file.updatedAt = new Date();

            await booking.save();

            res.status(200).json({
                success: true, message: "File status updated successfully.", file
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

            const booking = await Booking.findOne({ "filedFiles._id": id });
            if (!booking) return res.status(404).json({ success: false, message: "File not found." });

            // @ts-ignore
            booking.filedFiles.pull({ _id: id });
            await booking.save();

            res.status(200).json({
                success: true, message: "File deleted successfully.",
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    get: async (req: Request, res: Response) => {
        try {
            const { id } = req.params; // file id or query by bookingId
            const { bookingId } = req.query;

            if (id) {
                const booking = await Booking.findOne({ "filedFiles._id": id });
                if (!booking) return res.status(404).json({ success: false, message: "File not found." });
                // @ts-ignore
                const file = booking.filedFiles.id(id);
                return res.status(200).json({ success: true, file });
            }

            if (bookingId) {
                const booking = await Booking.findById(bookingId);
                if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

                return res.status(200).json({
                    success: true,
                    files: booking.filedFiles
                });
            }

            if (req.query.userId) {
                const { year } = req.query;
                const bookings = await Booking.find({ user: req.query.userId });
                let allFiles = bookings.reduce((acc: any[], b) => {
                    return acc.concat(b.filedFiles.map(f => ({ ...JSON.parse(JSON.stringify(f)), bookingId: b._id })));
                }, []);

                if (year && year !== 'All') {
                    allFiles = allFiles.filter(f => f.year?.toString() === year.toString());
                }

                return res.status(200).json({ success: true, files: allFiles });
            }

            // If no filters, and admin, maybe return all files across all bookings? (Expensive)
            return res.status(400).json({ success: false, message: "Please provide bookingId, userId or file Id." });

        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
    link: async (req: Request, res: Response) => {
        try {
            const { name, year, bookingId, type, url } = req.body;
            if (!url) return res.status(400).json({ success: false, message: "File URL is required." });
            if (!bookingId) return res.status(400).json({ success: false, message: "Booking ID is required." });

            const booking = await Booking.findById(bookingId);
            if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

            const newFile = {
                name,
                year,
                url,
                type: type || "user_doc",
                status: "sent",
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // @ts-ignore
            booking.filedFiles.push(newFile);
            await booking.save();

            const addedFile = booking.filedFiles[booking.filedFiles.length - 1];

            res.status(201).json({
                success: true, message: "File linked successfully.", file: addedFile
            });
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : "*Internal server error", success: false,
            });
        }
    },
}