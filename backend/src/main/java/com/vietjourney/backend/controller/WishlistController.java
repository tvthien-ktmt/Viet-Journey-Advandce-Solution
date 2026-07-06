package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.WishlistDTO;
import com.vietjourney.backend.entity.Wishlist;
import com.vietjourney.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.vietjourney.backend.util.PageableUtil;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping
    public ResponseEntity<ApiResponse<WishlistDTO>> addToWishlist(
            @RequestParam String itemType, 
            @RequestParam Long itemId, 
            Authentication authentication) {
        
        Wishlist wishlist = wishlistService.addToWishlist(authentication.getName(), itemType, itemId);
        return ResponseEntity.ok(ApiResponse.success(WishlistDTO.fromEntity(wishlist), "Đã thêm vào Wishlist"));
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
    public ResponseEntity<ApiResponse<Page<WishlistDTO>>> getMyWishlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            Authentication authentication) {
            
        Pageable pageable = PageableUtil.createPageable(page, size, sort);
        
        Page<Wishlist> wishlists = wishlistService.getUserWishlist(authentication.getName(), pageable);
        return ResponseEntity.ok(ApiResponse.success(wishlists.map(WishlistDTO::fromEntity), "Danh sách Wishlist"));
    }
}
