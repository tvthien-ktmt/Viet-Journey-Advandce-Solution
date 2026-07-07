package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vietjourney.backend.dto.response.*;
import com.vietjourney.backend.service.AdminService;
import com.vietjourney.backend.repository.FlightRepository;
import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.UserRepository;
import com.vietjourney.backend.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import java.util.stream.Collectors;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final BlogRepository blogRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDTO>> getAdminStats() {
        AdminStatsDTO stats = adminService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Admin stats fetched"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/flights")
    public ResponseEntity<List<AdminFlightDTO>> getFlights() {
        List<AdminFlightDTO> flights = flightRepository.findAll().stream().map(f -> 
            AdminFlightDTO.builder()
                .id(f.getId().toString())
                .flightNo(f.getFlightNumber())
                .from(f.getDepartureAirport())
                .to(f.getArrivalAirport())
                .departDate(f.getDepartureTime() != null ? f.getDepartureTime().toLocalDate().toString() : "")
                .departTime(f.getDepartureTime() != null ? f.getDepartureTime().toLocalTime().toString() : "")
                .aircraft("A321")
                .basePrice(f.getPrice())
                .status("ACTIVE")
                .build()
        ).collect(Collectors.toList());
        return ResponseEntity.ok(flights);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/bookings")
    public ResponseEntity<List<AdminBookingDTO>> getBookings() {
        List<AdminBookingDTO> bookings = bookingRepository.findAll().stream().map(b -> 
            AdminBookingDTO.builder()
                .id(b.getId().toString())
                .bookingCode("BK" + b.getId())
                .contactEmail(b.getContactEmail())
                .route(b.getBookingType().name())
                .date(b.getCreatedAt() != null ? b.getCreatedAt().toString() : "")
                .amount(b.getTotalPrice())
                .status(b.getStatus().name())
                .build()
        ).collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getUsers() {
        List<AdminUserDTO> users = userRepository.findAll().stream().map(u -> 
            AdminUserDTO.builder()
                .id(u.getId().toString())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .roles(java.util.Collections.singletonList(u.getRole()))
                .lotusmilesTier(u.getLotusmilesTier() != null ? u.getLotusmilesTier() : "MEMBER")
                .build()
        ).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/news")
    public ResponseEntity<List<AdminNewsDTO>> getNews() {
        List<AdminNewsDTO> news = blogRepository.findAll().stream().map(b -> 
            AdminNewsDTO.builder()
                .id(b.getId().toString())
                .title(b.getTitle())
                .category("TIN TỨC")
                .status("PUBLISHED")
                .date(b.getPublishedAt() != null ? b.getPublishedAt().toString() : "")
                .slug(b.getSlug())
                .build()
        ).collect(Collectors.toList());
        return ResponseEntity.ok(news);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @org.springframework.web.bind.annotation.PutMapping("/users/{id}/roles")
    public ResponseEntity<?> updateUserRoles(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody List<String> roles) {
        return userRepository.findById(id).map(user -> {
            if (roles != null && !roles.isEmpty()) {
                // Support multi-role if requested (but currently schema is single role, we'll join or just use first valid)
                String newRole = roles.get(0).toUpperCase().replace("ROLE_", "");
                if ("ADMIN".equals(newRole) || "USER".equals(newRole)) {
                    user.setRole(newRole);
                    userRepository.save(user);
                }
            }
            return ResponseEntity.ok(java.util.Collections.singletonMap("success", true));
        }).orElse(ResponseEntity.notFound().build());
    }
}
