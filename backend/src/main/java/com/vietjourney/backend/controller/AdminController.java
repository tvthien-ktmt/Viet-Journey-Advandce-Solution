package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

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
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = adminService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Admin stats fetched"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/flights")
    public ResponseEntity<List<Map<String, Object>>> getFlights() {
        List<Map<String, Object>> flights = flightRepository.findAll().stream().map(f -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId().toString());
            map.put("flightNo", f.getFlightNumber());
            map.put("from", f.getDepartureAirport());
            map.put("to", f.getArrivalAirport());
            map.put("departDate", f.getDepartureTime() != null ? f.getDepartureTime().toLocalDate().toString() : "");
            map.put("departTime", f.getDepartureTime() != null ? f.getDepartureTime().toLocalTime().toString() : "");
            map.put("aircraft", "A321");
            map.put("basePrice", f.getPrice());
            map.put("status", "ACTIVE");
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(flights);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/bookings")
    public ResponseEntity<List<Map<String, Object>>> getBookings() {
        List<Map<String, Object>> bookings = bookingRepository.findAll().stream().map(b -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId().toString());
            map.put("bookingCode", "BK" + b.getId());
            map.put("contactEmail", b.getContactEmail());
            map.put("route", b.getBookingType());
            map.put("date", b.getCreatedAt() != null ? b.getCreatedAt().toString() : "");
            map.put("amount", b.getTotalPrice());
            map.put("status", b.getStatus().name());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId().toString());
            map.put("email", u.getEmail());
            map.put("fullName", u.getFullName());
            map.put("roles", java.util.Collections.singletonList(u.getRole()));
            map.put("lotusmilesTier", u.getLotusmilesTier() != null ? u.getLotusmilesTier() : "MEMBER");
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/news")
    public ResponseEntity<List<Map<String, Object>>> getNews() {
        List<Map<String, Object>> news = blogRepository.findAll().stream().map(b -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId().toString());
            map.put("title", b.getTitle());
            map.put("category", "TIN TỨC");
            map.put("status", "PUBLISHED");
            map.put("date", b.getPublishedAt() != null ? b.getPublishedAt().toString() : "");
            map.put("slug", b.getSlug());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(news);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @org.springframework.web.bind.annotation.PutMapping("/users/{id}/roles")
    public ResponseEntity<?> updateUserRoles(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody List<String> roles) {
        return userRepository.findById(id).map(user -> {
            // Accept first valid role in the list
            if (roles != null && !roles.isEmpty()) {
                String newRole = roles.get(0).toUpperCase().replace("ROLE_", "");
                if ("ADMIN".equals(newRole) || "USER".equals(newRole)) {
                    user.setRole(newRole);
                    userRepository.save(user);
                }
            }
            Map<String, Boolean> res = new HashMap<>();
            res.put("success", true);
            return ResponseEntity.ok(res);
        }).orElse(ResponseEntity.notFound().build());
    }
}
