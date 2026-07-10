import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createPaymentUrl = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.body;

        const booking = await prisma.booking.findUnique({
            where: { id: Number(bookingId) },
            include: { payment: true }
        });

        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }

        if (booking.payment?.status === 'success') {
            res.status(400).json({ success: false, message: 'Booking is already paid' });
            return;
        }

        // Mock VNPay Logic
        // In a real application, you would construct the VNPAY parameters and create a secure hash
        const tmnCode = process.env.VNP_TMN_CODE || 'MOCK_TMN';
        const secureSecret = process.env.VNP_HASH_SECRET || 'MOCK_SECRET';
        const vnpUrl = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        const returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:5173/payment-return';

        const txnRef = `VNPAY_${bookingId}_${new Date().getTime()}`;
        const amount = booking.totalPrice * 100; // VNPay requires amount * 100

        const mockPaymentUrl = `${vnpUrl}?vnp_Amount=${amount}&vnp_Command=pay&vnp_CreateDate=20231010101010&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+booking+${bookingId}&vnp_OrderType=other&vnp_ReturnUrl=${encodeURIComponent(returnUrl)}&vnp_TmnCode=${tmnCode}&vnp_TxnRef=${txnRef}`;

        // Update payment table with pending transaction ID
        await prisma.payment.update({
            where: { bookingId: Number(bookingId) },
            data: { transactionId: txnRef, status: 'pending' }
        });

        res.json({ success: true, data: { paymentUrl: mockPaymentUrl } });
    } catch (error) {
        console.error('createPaymentUrl error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const vnpayIpn = async (req: Request, res: Response): Promise<void> => {
    try {
        const queryParams = req.query;
        // In a real application, you MUST verify the secure hash here using VNP_HASH_SECRET
        const txnRef = queryParams.vnp_TxnRef as string;
        const responseCode = queryParams.vnp_ResponseCode as string;

        if (!txnRef) {
            res.status(400).json({ Message: 'Invalid TxnRef', RspCode: '99' });
            return;
        }

        const payment = await prisma.payment.findFirst({
            where: { transactionId: txnRef }
        });

        if (!payment) {
            res.status(404).json({ Message: 'Order Not Found', RspCode: '01' });
            return;
        }

        if (payment.status === 'success') {
            res.status(200).json({ Message: 'Order already confirmed', RspCode: '02' });
            return;
        }

        if (responseCode === '00') {
            // Payment success
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'success', paymentDate: new Date() }
            });
            await prisma.booking.update({
                where: { id: payment.bookingId },
                data: { status: 'confirmed' }
            });
            res.status(200).json({ Message: 'Confirm Success', RspCode: '00' });
        } else {
            // Payment failed
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'failed' }
            });
            await prisma.booking.update({
                where: { id: payment.bookingId },
                data: { status: 'cancelled' }
            });
            res.status(200).json({ Message: 'Payment Failed', RspCode: '00' });
        }
    } catch (error) {
        console.error('vnpayIpn error:', error);
        res.status(500).json({ Message: 'Server Error', RspCode: '99' });
    }
};
