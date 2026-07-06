package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import com.vietjourney.backend.entity.Tour;

@Data
@Builder
public class TourDTO {
    private Long id;
    private String name;
    private String slug;
    private String image;
    private String location;
    private BigDecimal price;
    private BigDecimal oldPrice;
    private Double rating;
    private Integer reviewCount;
    private String duration;
    private Boolean isFeatured;

    public static TourDTO fromEntity(Tour tour) {
        return TourDTO.builder()
                .id(tour.getId())
                .name(tour.getName())
                .slug(tour.getSlug())
                .image(tour.getImage())
                .location(tour.getLocation())
                .price(tour.getPrice())
                .oldPrice(tour.getOldPrice())
                .rating(tour.getRating())
                .reviewCount(tour.getReviewCount())
                .duration(tour.getDuration())
                .isFeatured(tour.getIsFeatured())
                .build();
    }
}