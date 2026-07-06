package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.dto.request.PaymentRequest;
import com.vietjourney.backend.dto.response.PaymentResponse;
import com.vietjourney.backend.entity.Booking;
import com.vietjourney.backend.entity.enums.BookingStatus;
import com.vietjourney.backend.entity.Payment;
import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.PaymentRepository;
import com.vietjourney.backend.service.PaymentService;
import com.vietjourney.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import com.vietjourney.backend.service.strategy.payment.PaymentGatewayFactory;
import com.vietjourney.backend.service.strategy.payment.PaymentGatewayStrategy;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PaymentGatewayFactory paymentGatewayFactory;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.RESERVED) {
            throw new com.vietjourney.backend.exception.BusinessException("Chỉ có thể thanh toán booking đang trong trạng thái reserved", 409);
        }

        String transactionRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .booking(booking)
                .paymentMethod(request.getPaymentMethod())
                .status("pending")
                .transactionRef(transactionRef)
                .build();

        paymentRepository.save(payment);

        PaymentGatewayStrategy strategy = paymentGatewayFactory.getStrategy(request.getPaymentMethod());
        
        com.vietjourney.backend.service.strategy.payment.PaymentContext context = com.vietjourney.backend.service.strategy.payment.PaymentContext.builder()
            .transactionRef(transactionRef)
            .amount(booking.getTotalPrice())
            .orderInfo("Thanh toan don hang " + transactionRef)
            .build();
            
        return strategy.generatePaymentUrl(context);
    }

    @Override
    @Transactional
    public PaymentResponse handleCallback(java.util.Map<String, String> params) {
        String transactionRef = params.get("vnp_TxnRef");
        String status = params.get("vnp_ResponseCode");
        String amountRaw = params.get("vnp_Amount");
        
        Payment payment = paymentRepository.findByTransactionRef(transactionRef)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Payment not found"));

        if (amountRaw != null) {
            try {
                long amount = Long.parseLong(amountRaw);
                // VNPAY uses amount in VND * 100
                if ("VNPAY".equalsIgnoreCase(payment.getPaymentMethod())) {
                    long expectedAmount = payment.getBooking().getTotalPrice().longValue() * 100;
                    if (amount != expectedAmount) {
                        payment.setStatus("failed");
                        paymentRepository.save(payment);
                        throw new com.vietjourney.backend.exception.BusinessException("Amount mismatch. Expected: " + expectedAmount + ", Got: " + amount, 400);
                    }
                }
            } catch (NumberFormatException e) {
                payment.setStatus("failed");
                paymentRepository.save(payment);
                throw new com.vietjourney.backend.exception.BusinessException("Malformed amount", 400);
            }
        }

        PaymentGatewayStrategy strategy = paymentGatewayFactory.getStrategy(payment.getPaymentMethod());
        if (!strategy.verifyCallback(params)) {
            throw new com.vietjourney.backend.exception.BusinessException("Chữ ký thanh toán không hợp lệ.", 400);
        }

        if (!"pending".equals(payment.getStatus())) {
            return PaymentResponse.builder()
                    .transactionRef(transactionRef)
                    .status(payment.getStatus())
                    .build();
        }

        if (strategy.isSuccessStatus(status)) {
            payment.setStatus("completed");
            payment.setPaidAt(LocalDateTime.now());
            
            Booking booking = payment.getBooking();
            booking.transitionTo(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);

            if (booking.getUser() != null) {
                notificationService.createNotification(
                    booking.getUser().getEmail(), 
                    "Thanh toán thành công", 
                    "Đơn hàng " + transactionRef + " đã được thanh toán và xác nhận thành công."
                );
            }
        } else {
            payment.setStatus("failed");
            
            Booking booking = payment.getBooking();
            booking.transitionTo(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
        }

        paymentRepository.save(payment);

        return PaymentResponse.builder()
                .transactionRef(transactionRef)
                .status(payment.getStatus())
                .build();
    }
}
