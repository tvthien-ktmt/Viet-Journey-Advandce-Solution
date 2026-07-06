package com.vietjourney.backend.service;

import com.vietjourney.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    Review createReview(String userEmail, String itemType, Long itemId, Double rating, String comment);
    Page<Review> getReviews(String itemType, Long itemId, Pageable pageable);
}
