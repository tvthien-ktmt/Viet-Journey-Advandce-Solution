import nodemailer from 'nodemailer';
import logger from './logger';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
});

export const sendOTP = async (email: string, otp: string) => {
    if (!process.env.SMTP_USER) {
        logger.warn(`Mock send OTP to ${email}: ${otp}`);
        return true;
    }
    try {
        const mailOptions = {
            from: `"VietJourney Advance" <${process.env.SMTP_USER || 'no-reply@vietjourney.com'}>`,
            to: email,
            subject: 'Mã xác thực OTP - VietJourney',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #005f6e; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">VietJourney</h2>
                    </div>
                    <div style="padding: 20px;">
                        <h3>Xin chào,</h3>
                        <p>Bạn đã yêu cầu cấp lại mật khẩu. Vui lòng sử dụng mã OTP bên dưới để tiếp tục:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #005f6e; padding: 10px 20px; border: 2px dashed #005f6e; border-radius: 8px;">${otp}</span>
                        </div>
                        <p>Mã OTP này sẽ hết hạn trong vòng 5 phút.</p>
                        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
                        <br/>
                        <p>Trân trọng,<br/>Đội ngũ VietJourney</p>
                    </div>
                </div>
            `,
        };
        const info = await transporter.sendMail(mailOptions);
        logger.info(`OTP email sent to ${email}: ${info.messageId}`);
        // Log ethereal preview link if available (for testing)
        if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
            logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        return true;
    } catch (error) {
        logger.error('Error sending OTP email:', error);
        return false;
    }
};

export const sendInvoice = async (email: string, bookingCode: string, amount: number) => {
    if (!process.env.SMTP_USER) {
        logger.warn(`Mock send Invoice to ${email} for booking ${bookingCode}`);
        return true;
    }
    try {
        const mailOptions = {
            from: `"VietJourney Advance" <${process.env.SMTP_USER || 'no-reply@vietjourney.com'}>`,
            to: email,
            subject: `Xác nhận thanh toán thành công - Mã đặt chỗ ${bookingCode}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #005f6e; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Thanh toán thành công</h2>
                    </div>
                    <div style="padding: 20px;">
                        <h3>Kính gửi Quý khách,</h3>
                        <p>VietJourney xin xác nhận Quý khách đã thanh toán thành công cho mã đặt chỗ: <strong>${bookingCode}</strong></p>
                        <p>Số tiền thanh toán: <strong>${amount.toLocaleString('vi-VN')} VND</strong></p>
                        <p>Quý khách có thể xem chi tiết vé hoặc in hóa đơn trong phần Lịch sử đặt chỗ trên website.</p>
                        <br/>
                        <p>Cảm ơn Quý khách đã tin tưởng và sử dụng dịch vụ của VietJourney!</p>
                        <p>Trân trọng,<br/>Đội ngũ VietJourney</p>
                    </div>
                </div>
            `,
        };
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Invoice email sent to ${email}: ${info.messageId}`);
        if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
            logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        return true;
    } catch (error) {
        logger.error('Error sending invoice email:', error);
        return false;
    }
};
