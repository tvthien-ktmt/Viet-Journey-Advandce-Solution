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
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Page<Flight> searchFlights(String departureAirport, String arrivalAirport, LocalDateTime departureTime, Pageable pageable) {
        return flightRepository.searchFlights(departureAirport, arrivalAirport, departureTime, pageable);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Flight not found with id: " + id));
    }
}
