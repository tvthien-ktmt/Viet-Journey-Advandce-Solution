package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.dto.request.PaymentRequest;
import com.vietjourney.backend.dto.response.PaymentResponse;
import com.vietjourney.backend.entity.Booking;
import com.vietjourney.backend.entity.Payment;
import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.PaymentRepository;
import com.vietjourney.backend.service.PaymentService;
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

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Booking not found"));

        if (!"reserved".equals(booking.getStatus())) {
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
        return strategy.generatePaymentUrl(transactionRef);
    }

    @Override
    @Transactional
    public PaymentResponse handleCallback(String transactionRef, String status, String secureHash) {
        Payment payment = paymentRepository.findByTransactionRef(transactionRef)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Payment not found"));

        PaymentGatewayStrategy strategy = paymentGatewayFactory.getStrategy(payment.getPaymentMethod());
        if (!strategy.verifyCallback(transactionRef, status, secureHash)) {
            throw new com.vietjourney.backend.exception.BusinessException("Chữ ký thanh toán không hợp lệ.", 400);
        }

        if (!"pending".equals(payment.getStatus())) {
            return PaymentResponse.builder()
                    .transactionRef(transactionRef)
                    .status(payment.getStatus())
                    .build();
        }

        if ("completed".equals(status) || "success".equalsIgnoreCase(status) || "00".equals(status)) { // 00 là mã VNPay success
            payment.setStatus("completed");
            payment.setPaidAt(LocalDateTime.now());
            
            Booking booking = payment.getBooking();
            booking.setStatus("confirmed");
            bookingRepository.save(booking);
        } else {
            payment.setStatus("failed");
            
            Booking booking = payment.getBooking();
            booking.setStatus("cancelled");
            bookingRepository.save(booking);
        }

        paymentRepository.save(payment);

        return PaymentResponse.builder()
                .transactionRef(transactionRef)
                .status(payment.getStatus())
                .build();
    }
}
