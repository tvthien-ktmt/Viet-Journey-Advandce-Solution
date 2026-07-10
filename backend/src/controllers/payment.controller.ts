import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import qs from 'qs';
import logger from '../utils/logger';
import { sendInvoice } from '../utils/email.service';
import { getIO } from '../socket';

function sortObject(obj: any): any {
    const sorted: any = {};
    const str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}

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

        if (booking.userId !== req.user?.id) {
            res.status(403).json({ success: false, message: 'Forbidden: You do not own this booking' });
            return;
        }

        if (booking.payment?.status === 'SUCCESS') {
            res.status(400).json({ success: false, message: 'Booking is already paid' });
            return;
        }

        const tmnCode = process.env.VNP_TMN_CODE || 'MOCK_TMN';
        const secretKey = process.env.VNP_HASH_SECRET || 'MOCK_SECRET';
        const vnpUrl = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        const returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:5173/payment-return';

        const date = new Date();
        const createDate = String(date.getFullYear()) + 
            String(date.getMonth() + 1).padStart(2, '0') + 
            String(date.getDate()).padStart(2, '0') + 
            String(date.getHours()).padStart(2, '0') + 
            String(date.getMinutes()).padStart(2, '0') + 
            String(date.getSeconds()).padStart(2, '0');

        const txnRef = `VNPAY_${bookingId}_${date.getTime()}`;
        const amount = Number(booking.totalPrice) * 100;
        const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

        let vnp_Params: any = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': txnRef,
            'vnp_OrderInfo': `Thanh toan cho ma dat cho ${bookingId}`,
            'vnp_OrderType': 'other',
            'vnp_Amount': amount,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': createDate
        };

        vnp_Params = sortObject(vnp_Params);

        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex'); 
        vnp_Params['vnp_SecureHash'] = signed;

        const paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });

        if (booking.payment) {
            await prisma.payment.update({
                where: { bookingId: Number(bookingId) },
                data: { transactionId: txnRef, status: 'PENDING' }
            });
        } else {
            await prisma.payment.create({
                data: {
                    bookingId: Number(bookingId),
                    transactionId: txnRef,
                    status: 'PENDING',
                    amount: booking.totalPrice
                }
            });
        }

        res.json({ success: true, data: { paymentUrl } });
    } catch (error) {
        logger.error('createPaymentUrl error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const vnpayIpn = async (req: Request, res: Response): Promise<void> => {
    try {
        let vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        const secretKey = process.env.VNP_HASH_SECRET || 'MOCK_SECRET';
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');     

        if (secureHash === signed) {
            const txnRef = vnp_Params['vnp_TxnRef'] as string;
            const responseCode = vnp_Params['vnp_ResponseCode'] as string;

            const payment = await prisma.payment.findFirst({
                where: { transactionId: txnRef }
            });

            if (!payment) {
                res.status(404).json({ Message: 'Order Not Found', RspCode: '01' });
                return;
            }

            // Check if amount matches
            const amountInDb = Number(payment.amount) * 100;
            const amountInReq = Number(vnp_Params['vnp_Amount']);
            if (amountInDb !== amountInReq) {
                res.status(400).json({ Message: 'Invalid amount', RspCode: '04' });
                return;
            }

            if (payment.status === 'SUCCESS') {
                res.status(200).json({ Message: 'Order already confirmed', RspCode: '02' });
                return;
            }

            if (responseCode === '00') {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'SUCCESS', paymentDate: new Date() }
                });
                const updatedBooking = await prisma.booking.update({
                    where: { id: payment.bookingId },
                    data: { status: 'CONFIRMED' },
                    include: { user: true }
                });
                
                if (updatedBooking.bookingCode) {
                    try {
                        getIO().to(`booking-${updatedBooking.bookingCode}`).emit('payment-success', { bookingCode: updatedBooking.bookingCode });
                    } catch (e) {
                        logger.error('Socket emit error', e);
                    }
                }
                
                if (updatedBooking.user?.email && updatedBooking.bookingCode) {
                    await sendInvoice(updatedBooking.user.email, updatedBooking.bookingCode, Number(payment.amount));
                }
                
                if (updatedBooking.userId) {
                    const earnedMiles = Math.floor(Number(payment.amount) / 10000);
                    await prisma.user.update({
                        where: { id: updatedBooking.userId },
                        data: { lotusmilesMiles: { increment: earnedMiles } }
                    });
                    
                    const notif = await prisma.notification.create({
                        data: {
                            userId: updatedBooking.userId,
                            title: 'Thanh toán thành công & Tích lũy dặm',
                            message: `Đơn hàng ${updatedBooking.bookingCode} thanh toán thành công. Bạn đã tích lũy được ${earnedMiles} dặm thưởng Lotusmiles.`,
                        }
                    });
                    
                    try {
                        getIO().to(`user-${updatedBooking.userId}`).emit('notification', notif);
                    } catch (e) {}
                }

                res.status(200).json({ Message: 'Confirm Success', RspCode: '00' });
            } else {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'FAILED' }
                });
                await prisma.booking.update({
                    where: { id: payment.bookingId },
                    data: { status: 'CANCELLED' }
                });
                res.status(200).json({ Message: 'Payment Failed', RspCode: '00' });
            }
        } else {
            res.status(400).json({ Message: 'Invalid signature', RspCode: '97' });
        }
    } catch (error) {
        logger.error('vnpayIpn error:', error);
        res.status(500).json({ Message: 'Server Error', RspCode: '99' });
    }
};
