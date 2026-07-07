package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.entity.Review;
import com.vietjourney.backend.entity.User;
import com.vietjourney.backend.repository.ReviewRepository;
import com.vietjourney.backend.repository.TourRepository;
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
    private final TourRepository tourRepository;

    @Override
    @Transactional
    public Review createReview(String userEmail, String itemType, Long itemId, Double rating, String comment) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("User not found"));

        Review review = new Review();
        review.setUser(user);
        review.setItemType(itemType);
        review.setItemId(itemId);
        review.setRating(rating);
        review.setComment(com.vietjourney.backend.utils.HtmlSanitizer.sanitize(comment));

        Review saved = reviewRepository.save(review);

        // DB-HIGH-03: Sync denormalised rating/review_count on tours table in the same transaction
        if ("tour".equalsIgnoreCase(itemType)) {
            tourRepository.findById(itemId).ifPresent(tour -> {
                // Recompute from the reviews table to avoid drift
                java.util.List<Review> allReviews = reviewRepository.findAllByItemTypeAndItemId(itemType, itemId);
                double avg = allReviews.stream().mapToDouble(Review::getRating).average().orElse(0.0);
                tour.setRating(Math.round(avg * 10.0) / 10.0);
                tour.setReviewCount(allReviews.size());
                tourRepository.save(tour);
            });
        }

        return saved;
    }

    @Override
    public Page<Review> getReviews(String itemType, Long itemId, Pageable pageable) {
        return reviewRepository.findByItemTypeAndItemId(itemType, itemId, pageable);
    }
}
