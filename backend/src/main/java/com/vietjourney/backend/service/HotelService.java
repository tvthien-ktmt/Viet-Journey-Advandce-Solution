package com.vietjourney.backend.service;

import com.vietjourney.backend.dto.response.HotelDTO;
import com.vietjourney.backend.dto.response.HotelDetailDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface HotelService {
    Page<HotelDTO> searchHotels(String query, BigDecimal minPrice, BigDecimal maxPrice, String location, Pageable pageable);
    HotelDetailDTO getHotelBySlug(String slug);
    HotelDetailDTO getHotelById(Long id);
}
