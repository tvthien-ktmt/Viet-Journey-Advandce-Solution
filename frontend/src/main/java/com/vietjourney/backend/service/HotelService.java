package com.vietjourney.backend.service;

import com.vietjourney.backend.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface HotelService {
    Page<Hotel> searchHotels(String query, BigDecimal minPrice, BigDecimal maxPrice, String location, Pageable pageable);
    Hotel getHotelBySlug(String slug);
    Hotel getHotelById(Long id);
}
