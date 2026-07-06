package com.vietjourney.backend.service.strategy.payment;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class PaymentContext {
    private String transactionRef;
    private BigDecimal amount;
    private String orderInfo;
    private String ipAddr;
    private String returnUrl;
}
