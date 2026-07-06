package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.entity.Review;
import com.vietjourney.backend.entity.User;
import com.vietjourney.backend.repository.ReviewRepository;
import com.vietjourney.backend.repository.UserRepository;
import com.vietjourney.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Review createReview(String userEmail, String itemType, Long itemId, Double rating, String comment) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = Review.builder()
                .user(user)
                .itemType(itemType)
                .itemId(itemId)
                .rating(rating)
                .comment(comment)
                .build();

        return reviewRepository.save(review);
    }

    @Override
    public Page<Review> getReviews(String itemType, Long itemId, Pageable pageable) {
        return reviewRepository.findByItemTypeAndItemId(itemType, itemId, pageable);
    }
}
