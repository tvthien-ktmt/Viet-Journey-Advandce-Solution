package com.vietjourney.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightDTO {
    private Long id;
    private String airlineCode;
    private String flightNumber;
    private String departureAirport;
    private LocalDateTime departureTime;
    private String arrivalAirport;
    private LocalDateTime arrivalTime;
    private BigDecimal price;
    private String seatClass;
    private Integer availableSeats;
}
