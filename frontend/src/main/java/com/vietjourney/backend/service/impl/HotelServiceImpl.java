package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.entity.Hotel;
import com.vietjourney.backend.repository.HotelRepository;
import com.vietjourney.backend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;

    @Override
    public Page<Hotel> searchHotels(String query, BigDecimal minPrice, BigDecimal maxPrice, String location, Pageable pageable) {
        return hotelRepository.searchHotels(query, minPrice, maxPrice, location, pageable);
    }

    @Override
    public Hotel getHotelBySlug(String slug) {
        return hotelRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Hotel not found with slug: " + slug));
    }

    @Override
    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));
    }
}
