package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import com.vietjourney.backend.entity.Tour;

@Data
@Builder
public class TourDetailDTO {
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
    private String overview;
    private Boolean isFeatured;
    private List<ItineraryDTO> itinerary;
    private List<String> highlights;
    private List<String> included;
    private List<String> excluded;

    @Data
    @Builder
    public static class ItineraryDTO {
        private Integer dayNumber;
        private String dayTitle;
        private String content;
    }

    public static TourDetailDTO fromEntity(Tour tour) {
        return TourDetailDTO.builder()
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
                .overview(tour.getOverview())
                .isFeatured(tour.getIsFeatured())
                .itinerary(tour.getItinerary() != null ? tour.getItinerary().stream().map(i -> ItineraryDTO.builder().dayNumber(i.getDayNumber()).dayTitle(i.getDayTitle()).content(i.getContent()).build()).collect(Collectors.toList()) : null)
                .highlights(tour.getHighlights() != null ? tour.getHighlights().stream().map(h -> h.getContent()).collect(Collectors.toList()) : null)
                .included(tour.getIncluded() != null ? tour.getIncluded().stream().map(i -> i.getContent()).collect(Collectors.toList()) : null)
                .excluded(tour.getExcluded() != null ? tour.getExcluded().stream().map(e -> e.getContent()).collect(Collectors.toList()) : null)
                .build();
    }
}
