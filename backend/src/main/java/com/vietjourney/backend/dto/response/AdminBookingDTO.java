package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminBookingDTO {
    private String id;
    private String bookingCode;
    private String contactEmail;
    private String route;
    private String date;
    private java.math.BigDecimal amount;
    private String status;
}
