package com.vietjourney.backend.service.strategy.payment;

import com.vietjourney.backend.dto.response.PaymentResponse;

public interface PaymentGatewayStrategy {
    PaymentResponse generatePaymentUrl(String transactionRef);
    boolean verifyCallback(String transactionRef, String status, String secureHash);
}
