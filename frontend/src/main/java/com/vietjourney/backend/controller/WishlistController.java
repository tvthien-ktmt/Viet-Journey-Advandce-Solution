package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.entity.Wishlist;
import com.vietjourney.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping
    public ResponseEntity<ApiResponse<Wishlist>> addToWishlist(
            @RequestParam String itemType, 
            @RequestParam Long itemId, 
            Authentication authentication) {
        
        Wishlist wishlist = wishlistService.addToWishlist(authentication.getName(), itemType, itemId);
        return ResponseEntity.ok(ApiResponse.success(wishlist, "Đã thêm vào Wishlist"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            @RequestParam String itemType, 
            @RequestParam Long itemId, 
            Authentication authentication) {
        
        wishlistService.removeFromWishlist(authentication.getName(), itemType, itemId);
        return ResponseEntity.ok(ApiResponse.success(null, "Đã xóa khỏi Wishlist"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Wishlist>>> getMyWishlist(Authentication authentication) {
        List<Wishlist> wishlists = wishlistService.getUserWishlist(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(wishlists, "Danh sách Wishlist"));
    }
}
