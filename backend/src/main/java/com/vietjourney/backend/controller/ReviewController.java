package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.ReviewDTO;
import com.vietjourney.backend.entity.Review;
import com.vietjourney.backend.service.ReviewService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ReviewDTO>>> getReviews(
            @RequestParam String itemType, 
            @RequestParam Long itemId, 
            Pageable pageable) {
        
        Page<Review> reviews = reviewService.getReviews(itemType, itemId, pageable);
        Page<ReviewDTO> reviewDTOs = reviews.map(ReviewDTO::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(reviewDTOs, "Danh sách đánh giá"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDTO>> createReview(
            @Valid @RequestBody ReviewRequest request, 
            Authentication authentication) {
        
        Review review = reviewService.createReview(
                authentication.getName(), 
                request.getItemType(), 
                request.getItemId(), 
                request.getRating(), 
                request.getComment()
        );
        return ResponseEntity.ok(ApiResponse.success(ReviewDTO.fromEntity(review), "Tạo đánh giá thành công"));
    }

    @Data
    public static class ReviewRequest {
        @NotBlank(message = "Item type cannot be empty")
        private String itemType;
        
        @NotNull(message = "Item ID is required")
        private Long itemId;
        
        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        private Double rating;
        
        @NotBlank(message = "Comment cannot be empty")
        @Size(max = 1000, message = "Comment must not exceed 1000 characters")
        private String comment;
    }
}
