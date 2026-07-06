package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.HotelDTO;
import com.vietjourney.backend.dto.response.HotelDetailDTO;
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
    public ResponseEntity<ApiResponse<Page<HotelDTO>>> getHotels(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        
        Pageable pageable = com.vietjourney.backend.util.PageableUtil.createPageable(page, size, sort);
        Page<HotelDTO> hotels = hotelService.searchHotels(query, minPrice, maxPrice, location, pageable);
        return ResponseEntity.ok(ApiResponse.success(hotels, "Lấy danh sách Khách sạn thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HotelDetailDTO>> getHotelById(@PathVariable Long id) {
        HotelDetailDTO hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(ApiResponse.success(hotel, "Lấy chi tiết Khách sạn thành công"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<HotelDetailDTO>> getHotelBySlug(@PathVariable String slug) {
        HotelDetailDTO hotel = hotelService.getHotelBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(hotel, "Lấy chi tiết Khách sạn thành công"));
    }
}
