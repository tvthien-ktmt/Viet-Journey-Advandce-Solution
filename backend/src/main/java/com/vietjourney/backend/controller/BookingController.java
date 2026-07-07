package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.request.BookingRequest;
import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.BookingDTO;
import com.vietjourney.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.vietjourney.backend.utils.PageableUtil;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDTO>> createBooking(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        BookingDTO bookingDTO = bookingService.createReservation(request, email);
        return ResponseEntity.ok(ApiResponse.success(bookingDTO, "Tạo Booking thành công, giữ chỗ trong 10 phút."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingDTO>> getBooking(@PathVariable Long id, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        if (email == null) throw new com.vietjourney.backend.exception.UnauthorizedActionException("Unauthorized");
        BookingDTO bookingDTO = bookingService.getBookingByIdAndUser(id, email);
        return ResponseEntity.ok(ApiResponse.success(bookingDTO, "Chi tiết Booking"));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<Page<BookingDTO>>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            Authentication authentication) {
        if (authentication == null) {
            throw new com.vietjourney.backend.exception.UnauthorizedActionException("Unauthorized");
        }
        
        Pageable pageable = PageableUtil.createPageable(page, size, sort);
        
        Page<BookingDTO> dtos = bookingService.getUserBookings(authentication.getName(), pageable);
        return ResponseEntity.ok(ApiResponse.success(dtos, "Lịch sử Booking"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<BookingDTO>> searchBooking(
            @RequestParam String code,
            @RequestParam String lastName) {
        BookingDTO dto = bookingService.searchByCodeAndLastName(code, lastName);
        dto.maskPII();
        return ResponseEntity.ok(ApiResponse.success(dto, "Tìm thấy đặt chỗ"));
    }
}
