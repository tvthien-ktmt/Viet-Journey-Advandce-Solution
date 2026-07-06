package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.entity.Flight;
import com.vietjourney.backend.repository.FlightRepository;
import com.vietjourney.backend.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;

    @Override
    public Page<Flight> searchFlights(String departureAirport, String arrivalAirport, LocalDateTime departureTime, Pageable pageable) {
        return flightRepository.searchFlights(departureAirport, arrivalAirport, departureTime, pageable);
    }

    @Override
    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
    }
}
