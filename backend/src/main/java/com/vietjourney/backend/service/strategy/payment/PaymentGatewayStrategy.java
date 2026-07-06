package com.vietjourney.backend.service.strategy.payment;

import com.vietjourney.backend.dto.response.PaymentResponse;

public interface PaymentGatewayStrategy {
    PaymentResponse generatePaymentUrl(String transactionRef);
    boolean verifyCallback(java.util.Map<String, String> params);
    boolean isSuccessStatus(String status);
}
