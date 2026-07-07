package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.TourDTO;
import com.vietjourney.backend.dto.response.TourDetailDTO;
import com.vietjourney.backend.entity.Tour;
import com.vietjourney.backend.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TourDTO>>> getTours(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        
        Pageable pageable = com.vietjourney.backend.utils.PageableUtil.createPageable(page, size, sort);
        Page<Tour> tours = tourService.searchTours(query, minPrice, maxPrice, location, pageable);
        Page<TourDTO> tourDTOs = tours.map(TourDTO::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(tourDTOs, "Lấy danh sách Tour thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TourDetailDTO>> getTourById(@PathVariable Long id) {
        Tour tour = tourService.getTourById(id);
        return ResponseEntity.ok(ApiResponse.success(TourDetailDTO.fromEntity(tour), "Lấy chi tiết Tour thành công"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<TourDetailDTO>> getTourBySlug(@PathVariable String slug) {
        Tour tour = tourService.getTourBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(TourDetailDTO.fromEntity(tour), "Lấy chi tiết Tour thành công"));
    }
}
