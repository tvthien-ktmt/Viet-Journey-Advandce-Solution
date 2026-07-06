package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.dto.response.HotelDTO;
import com.vietjourney.backend.dto.response.HotelDetailDTO;
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
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Page<HotelDTO> searchHotels(String query, BigDecimal minPrice, BigDecimal maxPrice, String location, Pageable pageable) {
        Page<Hotel> hotels = hotelRepository.searchHotels(query, minPrice, maxPrice, location, pageable);
        return hotels.map(this::mapToDTO);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public HotelDetailDTO getHotelBySlug(String slug) {
        Hotel hotel = hotelRepository.findBySlug(slug)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Hotel not found with slug: " + slug));
        return mapToDetailDTO(hotel);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public HotelDetailDTO getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Hotel not found with id: " + id));
        return mapToDetailDTO(hotel);
    }

    private HotelDTO mapToDTO(Hotel hotel) {
        return HotelDTO.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .slug(hotel.getSlug())
                .image(hotel.getImage())
                .location(hotel.getLocation())
                .price(hotel.getPrice())
                .rating(hotel.getRating())
                .reviewCount(hotel.getReviewCount())
                .createdAt(hotel.getCreatedAt())
                .updatedAt(hotel.getUpdatedAt())
                .build();
    }

    private HotelDetailDTO mapToDetailDTO(Hotel hotel) {
        return HotelDetailDTO.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .slug(hotel.getSlug())
                .image(hotel.getImage())
                .location(hotel.getLocation())
                .price(hotel.getPrice())
                .rating(hotel.getRating())
                .reviewCount(hotel.getReviewCount())
                .createdAt(hotel.getCreatedAt())
                .updatedAt(hotel.getUpdatedAt())
                .amenities(hotel.getAmenities())
                .rooms(hotel.getRooms())
                .build();
    }
}
