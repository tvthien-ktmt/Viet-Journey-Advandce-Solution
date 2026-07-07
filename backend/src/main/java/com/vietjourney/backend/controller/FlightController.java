package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.entity.Flight;
import com.vietjourney.backend.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import com.vietjourney.backend.dto.response.FlightDTO;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping(value = {"", "/search"})
    public ResponseEntity<ApiResponse<Page<FlightDTO>>> getFlights(
            @RequestParam(required = false) String departureAirport,
            @RequestParam(required = false) String arrivalAirport,
            @RequestParam(required = false) LocalDateTime departureTime,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        
        Pageable pageable = com.vietjourney.backend.utils.PageableUtil.createPageable(page, size, sort);
        Page<Flight> flights = flightService.searchFlights(departureAirport, arrivalAirport, departureTime, pageable);
        Page<FlightDTO> flightDTOs = flights.map(this::mapToDTO);
        return ResponseEntity.ok(ApiResponse.success(flightDTOs, "Lấy danh sách Chuyến bay thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FlightDTO>> getFlightById(@PathVariable Long id) {
        Flight flight = flightService.getFlightById(id);
        return ResponseEntity.ok(ApiResponse.success(mapToDTO(flight), "Lấy chi tiết Chuyến bay thành công"));
    }

    private FlightDTO mapToDTO(Flight flight) {
        return FlightDTO.builder()
                .id(flight.getId())
                .airlineCode(flight.getAirlineCode())
                .flightNumber(flight.getFlightNumber())
                .departureAirport(flight.getDepartureAirport())
                .departureTime(flight.getDepartureTime())
                .arrivalAirport(flight.getArrivalAirport())
                .arrivalTime(flight.getArrivalTime())
                .price(flight.getPrice())
                .seatClass(flight.getSeatClass())
                .availableSeats(flight.getAvailableSeats())
                .build();
    }
}
