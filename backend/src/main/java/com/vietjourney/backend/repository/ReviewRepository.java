package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByItemTypeAndItemId(String itemType, Long itemId, Pageable pageable);
}
