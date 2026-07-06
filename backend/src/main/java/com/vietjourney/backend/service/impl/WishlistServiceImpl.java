package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.entity.User;
import com.vietjourney.backend.entity.Wishlist;
import com.vietjourney.backend.repository.UserRepository;
import com.vietjourney.backend.repository.WishlistRepository;
import com.vietjourney.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Wishlist addToWishlist(String userEmail, String itemType, Long itemId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("User not found"));

        boolean exists = wishlistRepository.existsByUserEmailAndItemTypeAndItemId(userEmail, itemType, itemId);
        if (exists) {
            throw new com.vietjourney.backend.exception.DuplicateResourceException("Mục này đã có trong danh sách yêu thích của bạn.");
        }

        Wishlist newWishlist = Wishlist.builder()
                .user(user)
                .itemType(itemType)
                .itemId(itemId)
                .build();
        return wishlistRepository.save(newWishlist);
    }

    @Override
    @Transactional
    public void removeFromWishlist(String userEmail, String itemType, Long itemId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("User not found"));
        wishlistRepository.deleteByUserIdAndItemTypeAndItemId(user.getId(), itemType, itemId);
    }

    @Override
    public Page<Wishlist> getUserWishlist(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("User not found"));
        return wishlistRepository.findByUserId(user.getId(), pageable);
    }
}
