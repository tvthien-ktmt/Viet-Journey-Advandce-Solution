package com.vietjourney.backend.dto.response;

import com.vietjourney.backend.entity.Wishlist;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WishlistDTO {
    private Long id;
    private Long userId;
    private String itemType;
    private Long itemId;
    private LocalDateTime createdAt;

    public static WishlistDTO fromEntity(Wishlist wishlist) {
        return WishlistDTO.builder()
                .id(wishlist.getId())
                .userId(wishlist.getUser() != null ? wishlist.getUser().getId() : null)
                .itemType(wishlist.getItemType())
                .itemId(wishlist.getItemId())
                .createdAt(wishlist.getCreatedAt())
                .build();
    }
}
