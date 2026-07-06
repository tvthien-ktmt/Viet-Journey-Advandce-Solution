package com.vietjourney.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BookingRequest {
    @NotBlank
    private String bookingType; // tour, hotel, flight

    @NotNull
    private Long referenceId;

    @NotNull
    private BigDecimal totalPrice;

    private List<PassengerRequest> passengers;
}
