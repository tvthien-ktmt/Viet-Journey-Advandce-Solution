package com.vietjourney.backend.service;

import com.vietjourney.backend.entity.Flight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface FlightService {
    Page<Flight> searchFlights(String departureAirport, String arrivalAirport, LocalDateTime departureTime, Pageable pageable);
    Flight getFlightById(Long id);
}
