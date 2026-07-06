package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);
    Page<Wishlist> findByUserId(Long userId, Pageable pageable);
    Optional<Wishlist> findByUserIdAndItemTypeAndItemId(Long userId, String itemType, Long itemId);
    void deleteByUserIdAndItemTypeAndItemId(Long userId, String itemType, Long itemId);
    boolean existsByUserEmailAndItemTypeAndItemId(String email, String itemType, Long itemId);
}
