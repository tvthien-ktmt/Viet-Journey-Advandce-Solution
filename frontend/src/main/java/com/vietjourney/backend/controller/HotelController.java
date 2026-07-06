package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.entity.Hotel;
import com.vietjourney.backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Hotel>>> getHotels(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String location,
            Pageable pageable) {
        
        Page<Hotel> hotels = hotelService.searchHotels(query, minPrice, maxPrice, location, pageable);
        return ResponseEntity.ok(ApiResponse.success(hotels, "Lấy danh sách Khách sạn thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hotel>> getHotelById(@PathVariable Long id) {
        Hotel hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(ApiResponse.success(hotel, "Lấy chi tiết Khách sạn thành công"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<Hotel>> getHotelBySlug(@PathVariable String slug) {
        Hotel hotel = hotelService.getHotelBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(hotel, "Lấy chi tiết Khách sạn thành công"));
    }
}
