package com.vietjourney.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.Valid;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BookingRequest {
    @NotBlank
    private String bookingType; // tour, hotel, flight

    @NotNull
    private Long referenceId;

    @NotBlank
    private String contactEmail;
    
    @NotBlank
    private String contactPhone;

    @Valid
    @Size(max = 9)
    private List<PassengerRequest> passengers;
}
