package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.request.BookingRequest;
import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.entity.Booking;
import com.vietjourney.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        Booking booking = bookingService.createReservation(request, email);
        return ResponseEntity.ok(ApiResponse.success(booking, "Tạo Booking thành công, giữ chỗ trong 10 phút."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(booking, "Chi tiết Booking"));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getMyBookings(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Unauthorized");
        }
        List<Booking> bookings = bookingService.getUserBookings(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(bookings, "Lịch sử Booking"));
    }
}
