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
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Override
    public BigDecimal getUnitPrice(Long referenceId) {
        Flight flight = flightRepository.findById(referenceId)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Flight not found"));
        return flight.getPrice();
    }

    @Override
    public void validateAndReserve(Long referenceId, int quantity) {
        int updated = flightRepository.decrementAvailableSeats(referenceId, quantity);
        if (updated == 0) {
            throw new com.vietjourney.backend.exception.BusinessException("Không đủ ghế trống. Vui lòng chọn chuyến bay khác.", 409);
        }
    }

    @Override
    public void release(Long referenceId, int quantity) {
        flightRepository.incrementAvailableSeats(referenceId, quantity);
    }

    @Override
    public String getItemSnapshot(Long referenceId) {
        Flight flight = flightRepository.findById(referenceId)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Flight not found"));
        try {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("flightNo", flight.getFlightNumber());
            map.put("from", flight.getDepartureAirport());
            map.put("to", flight.getArrivalAirport());
            map.put("airline", flight.getAirlineCode());
            map.put("departTime", flight.getDepartureTime() != null ? flight.getDepartureTime().toString() : null);
            map.put("arriveTime", flight.getArrivalTime() != null ? flight.getArrivalTime().toString() : null);
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            return "{}";
        }
    }
}
