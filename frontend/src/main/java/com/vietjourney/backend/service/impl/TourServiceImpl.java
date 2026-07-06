package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.entity.Tour;
import com.vietjourney.backend.repository.TourRepository;
import com.vietjourney.backend.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class TourServiceImpl implements TourService {

    private final TourRepository tourRepository;

    @Override
    public Page<Tour> searchTours(String query, BigDecimal minPrice, BigDecimal maxPrice, String location, Pageable pageable) {
        return tourRepository.searchTours(query, minPrice, maxPrice, location, pageable);
    }

    @Override
    public Tour getTourBySlug(String slug) {
        return tourRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Tour not found with slug: " + slug));
    }

    @Override
    public Tour getTourById(Long id) {
        return tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + id));
    }
}
