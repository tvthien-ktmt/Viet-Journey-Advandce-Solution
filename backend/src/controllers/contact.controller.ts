import { Request, Response } from 'express';
import logger from '../utils/logger';

export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        if (!name || !email || !message) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

        // Mock saving/sending email
        logger.info(`Received contact form from ${name} (${email}): ${subject}`);

        res.json({ success: true, message: 'Cảm ơn bạn đã liên hệ, chúng tôi sẽ phản hồi sớm nhất!' });
    } catch (error) {
        logger.error('submitContactForm error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
