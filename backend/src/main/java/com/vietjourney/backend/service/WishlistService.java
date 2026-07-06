package com.vietjourney.backend.service;

import com.vietjourney.backend.entity.Wishlist;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WishlistService {
    Wishlist addToWishlist(String userEmail, String itemType, Long itemId);
    void removeFromWishlist(String userEmail, String itemType, Long itemId);
    Page<Wishlist> getUserWishlist(String userEmail, Pageable pageable);
}
