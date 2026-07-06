package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", bookingRepository.count());
        
        java.math.BigDecimal revenue = paymentRepository.sumRevenue();
        // Format to string like "12M VND" or just return raw amount
        stats.put("revenue", revenue.longValue() + " VND");
        return ResponseEntity.ok(ApiResponse.success(stats, "Admin stats fetched"));
    }
}
