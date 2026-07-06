package com.vietjourney.backend.service.strategy.booking;

import com.vietjourney.backend.entity.Flight;
import com.vietjourney.backend.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component("flightBookingStrategy")
@RequiredArgsConstructor
public class FlightBookingStrategy implements BookingItemStrategy {

    private final FlightRepository flightRepository;

    @Override
    public BigDecimal getUnitPrice(Long referenceId) {
        Flight flight = flightRepository.findById(referenceId)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Flight not found"));
        return flight.getPrice();
    }
}
