package com.vietjourney.backend.service.strategy.payment;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.HashMap;

@Component
public class PaymentGatewayFactory {

    private final Map<String, PaymentGatewayStrategy> strategies = new HashMap<>();

    public PaymentGatewayFactory(VNPayStrategyImpl vnPayStrategyImpl) {
        // Có thể thêm MomoStrategy, StripeStrategy ở đây
        strategies.put("vnpay", vnPayStrategyImpl);
    }

    public PaymentGatewayStrategy getStrategy(String paymentMethod) {
        PaymentGatewayStrategy strategy = strategies.get(paymentMethod.toLowerCase());
        if (strategy == null) {
            throw new com.vietjourney.backend.exception.BusinessException("Cổng thanh toán không được hỗ trợ: " + paymentMethod);
        }
        return strategy;
    }
}
