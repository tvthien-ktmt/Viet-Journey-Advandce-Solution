package com.vietjourney.backend.service;

import com.vietjourney.backend.entity.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface TourService {
    Page<Tour> searchTours(String query, BigDecimal minPrice, BigDecimal maxPrice, String location, Pageable pageable);
    Tour getTourBySlug(String slug);
    Tour getTourById(Long id);
}
