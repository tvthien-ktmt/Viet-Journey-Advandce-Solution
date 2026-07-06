package com.vietjourney.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.vietjourney.backend.entity.HotelAmenity;
import com.vietjourney.backend.entity.HotelRoom;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelDetailDTO {
    private Long id;
    private String name;
    private String slug;
    private String image;
    private String location;
    private BigDecimal price;
    private Double rating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private List<HotelAmenityDTO> amenities;
    private List<HotelRoomDTO> rooms;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HotelAmenityDTO {
        private Long id;
        private String name;
        private String icon;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HotelRoomDTO {
        private Long id;
        private String roomType;
        private Integer capacity;
        private BigDecimal pricePerNight;
        private String image;
    }

    public static HotelDetailDTO fromEntity(com.vietjourney.backend.entity.Hotel hotel) {
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
                .amenities(hotel.getAmenities().stream()
                        .map(a -> HotelAmenityDTO.builder()
                                .id(a.getId())
                                .name(a.getName())
                                .icon("") // placeholder
                                .build())
                        .collect(java.util.stream.Collectors.toList()))
                .rooms(hotel.getRooms().stream()
                        .map(r -> HotelRoomDTO.builder()
                                .id(r.getId())
                                .roomType(r.getName())
                                .capacity(r.getCapacity())
                                .pricePerNight(r.getPrice())
                                .image("") // placeholder
                                .build())
                        .collect(java.util.stream.Collectors.toList()))
                .build();
    }
}
