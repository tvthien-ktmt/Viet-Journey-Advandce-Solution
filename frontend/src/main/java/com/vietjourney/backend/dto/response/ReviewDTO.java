package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import com.vietjourney.backend.entity.Review;

@Data
@Builder
public class ReviewDTO {
    private Long id;
    private UserSummaryDTO user;
    private String itemType;
    private Long itemId;
    private Double rating;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewDTO fromEntity(Review review) {
        UserSummaryDTO userDto = null;
        if (review.getUser() != null) {
            userDto = UserSummaryDTO.builder()
                    .id(review.getUser().getId())
                    .fullName(review.getUser().getFullName())
                    .email(review.getUser().getEmail())
                    .build();
        }

        return ReviewDTO.builder()
                .id(review.getId())
                .user(userDto)
                .itemType(review.getItemType())
                .itemId(review.getItemId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}