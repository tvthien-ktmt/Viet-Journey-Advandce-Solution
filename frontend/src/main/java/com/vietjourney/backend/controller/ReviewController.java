package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.entity.Review;
import com.vietjourney.backend.service.ReviewService;
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
    public ResponseEntity<ApiResponse<Page<Review>>> getReviews(
            @RequestParam String itemType, 
            @RequestParam Long itemId, 
            Pageable pageable) {
        
        Page<Review> reviews = reviewService.getReviews(itemType, itemId, pageable);
        return ResponseEntity.ok(ApiResponse.success(reviews, "Danh sách đánh giá"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Review>> createReview(
            @RequestBody ReviewRequest request, 
            Authentication authentication) {
        
        Review review = reviewService.createReview(
                authentication.getName(), 
                request.getItemType(), 
                request.getItemId(), 
                request.getRating(), 
                request.getComment()
        );
        return ResponseEntity.ok(ApiResponse.success(review, "Tạo đánh giá thành công"));
    }

    @Data
    public static class ReviewRequest {
        private String itemType;
        private Long itemId;
        private Double rating;
        private String comment;
    }
}
