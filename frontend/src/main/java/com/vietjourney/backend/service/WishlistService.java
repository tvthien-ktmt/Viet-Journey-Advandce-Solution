package com.vietjourney.backend.service;

import com.vietjourney.backend.entity.Wishlist;

import java.util.List;

public interface WishlistService {
    Wishlist addToWishlist(String userEmail, String itemType, Long itemId);
    void removeFromWishlist(String userEmail, String itemType, Long itemId);
    List<Wishlist> getUserWishlist(String userEmail);
}
