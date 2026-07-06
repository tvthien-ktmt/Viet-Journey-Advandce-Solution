package com.vietjourney.backend.service.strategy.booking;

import java.math.BigDecimal;

public interface BookingItemStrategy {
    BigDecimal getUnitPrice(Long referenceId);
}
