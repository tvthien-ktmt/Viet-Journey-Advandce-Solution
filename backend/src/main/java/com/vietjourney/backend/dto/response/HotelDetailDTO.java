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
    
    // In a real scenario, these should also be DTOs, but since the original entity 
    // serialization just serialized the collections, we can include them here.
    private List<HotelAmenity> amenities;
    private List<HotelRoom> rooms;
}
