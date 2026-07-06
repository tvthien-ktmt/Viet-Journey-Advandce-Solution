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

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Wishlist addToWishlist(String userEmail, String itemType, Long itemId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return wishlistRepository.findByUserIdAndItemTypeAndItemId(user.getId(), itemType, itemId)
                .orElseGet(() -> {
                    Wishlist newWishlist = Wishlist.builder()
                            .user(user)
                            .itemType(itemType)
                            .itemId(itemId)
                            .build();
                    return wishlistRepository.save(newWishlist);
                });
    }

    @Override
    @Transactional
    public void removeFromWishlist(String userEmail, String itemType, Long itemId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        wishlistRepository.deleteByUserIdAndItemTypeAndItemId(user.getId(), itemType, itemId);
    }

    @Override
    public List<Wishlist> getUserWishlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return wishlistRepository.findByUserId(user.getId());
    }
}
