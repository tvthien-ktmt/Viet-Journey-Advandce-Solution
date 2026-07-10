import { Request, Response } from 'express';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }

        const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

        res.json({
            success: true,
            data: { url: fileUrl }
        });
    } catch (error) {
        console.error('uploadFile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
