import prisma from '../utils/prisma';
import logger from '../utils/logger';
import { getIO } from '../socket';
import { sendInvoice } from '../utils/email.service';

let isPolling = false;

export const startSepayCron = () => {
    const interval = Number(process.env.PAYMENT_CHECK_INTERVAL || 3000);
    
    setInterval(async () => {
        if (isPolling) return;
        isPolling = true;

        try {
            const pendingPayments = await prisma.payment.findMany({
                where: { status: 'PENDING' }
            });

            if (pendingPayments.length === 0) {
                isPolling = false;
                return;
            }

            const response = await fetch(process.env.SEPAY_API_URL + '/transactions/list', {
                headers: {
                    'Authorization': `Bearer ${process.env.SEPAY_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            if (!data || !data.transactions) {
                isPolling = false;
                return;
            }

            const transactions = data.transactions;

            for (const payment of pendingPayments) {
                // Ensure strict timeout, EXPIRED state will be handled by payment.cron.ts or logic
                const timeout = Number(process.env.PAYMENT_TIMEOUT || 300000);
                const isExpired = new Date(payment.createdAt).getTime() + timeout < Date.now();
                if (isExpired) continue;

                if (!payment.transactionId) continue;

                const matchingTx = transactions.find((tx: any) => 
                    tx.transaction_content.includes(payment.transactionId) &&
                    Number(tx.amount_in) >= Number(payment.amount)
                );

                if (matchingTx) {
                    let updatedBookingResult: any = null;
                    let earnedMilesResult: number = 0;

                    await prisma.$transaction(async (tx) => {
                        await tx.$executeRawUnsafe(`SELECT * FROM \`Payment\` WHERE id = ? FOR UPDATE`, payment.id);
                        const p = await tx.payment.findUnique({ where: { id: payment.id } });
                        if (!p || p.status !== 'PENDING') return;

                        await tx.payment.update({
                            where: { id: p.id },
                            data: { status: 'SUCCESS', paymentDate: new Date() }
                        });
                        
                        updatedBookingResult = await tx.booking.update({
                            where: { id: p.bookingId },
                            data: { status: 'CONFIRMED' },
                            include: { user: true }
                        });

                        if (updatedBookingResult.userId) {
                            earnedMilesResult = Math.floor(Number(p.amount) / 10000);
                            await tx.user.update({
                                where: { id: updatedBookingResult.userId },
                                data: { lotusmilesMiles: { increment: earnedMilesResult } }
                            });
                            
                            await tx.notification.create({
                                data: {
                                    userId: updatedBookingResult.userId,
                                    title: 'Thanh toán thành công & Tích lũy dặm',
                                    message: `Đơn hàng ${updatedBookingResult.bookingCode} thanh toán thành công. Bạn đã tích lũy được ${earnedMilesResult} dặm thưởng Lotusmiles.`,
                                }
                            });
                        }
                    });

                    if (updatedBookingResult && updatedBookingResult.bookingCode) {
                        try {
                            getIO().to(`booking-${updatedBookingResult.bookingCode}`).emit('payment-success', { bookingCode: updatedBookingResult.bookingCode });
                        } catch (e) { logger.error('Socket emit error', e); }

                        if (updatedBookingResult.user?.email) {
                            await sendInvoice(updatedBookingResult.user.email, updatedBookingResult.bookingCode, Number(payment.amount));
                        }
                    }
                }
            }
        } catch (error) {
            logger.error('SePay polling error:', error);
        } finally {
            isPolling = false;
        }
    }, interval);
};
