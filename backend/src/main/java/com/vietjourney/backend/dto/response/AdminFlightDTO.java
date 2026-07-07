package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminFlightDTO {
    private String id;
    private String flightNo;
    private String from;
    private String to;
    private String departDate;
    private String departTime;
    private String aircraft;
    private java.math.BigDecimal basePrice;
    private String status;
}
