package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByItemTypeAndItemId(String itemType, Long itemId, Pageable pageable);

    // Used by ReviewServiceImpl to recompute denormalised rating/review_count
    List<Review> findAllByItemTypeAndItemId(String itemType, Long itemId);
}
