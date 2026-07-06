package com.vietjourney.backend.unit.service;

import com.vietjourney.backend.entity.User;
import com.vietjourney.backend.entity.Wishlist;
import com.vietjourney.backend.exception.DuplicateResourceException;
import com.vietjourney.backend.repository.UserRepository;
import com.vietjourney.backend.repository.WishlistRepository;
import com.vietjourney.backend.service.impl.WishlistServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WishlistServiceTest {

    @Mock
    private WishlistRepository wishlistRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private WishlistServiceImpl wishlistService;

    private User testUser;
    private Wishlist testWishlist;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("user@test.com").build();
        testWishlist = Wishlist.builder().id(1L).user(testUser).itemType("tour").itemId(1L).build();
    }

    @Test
    void addToWishlist_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(wishlistRepository.existsByUserEmailAndItemTypeAndItemId(anyString(), anyString(), anyLong())).thenReturn(false);
        when(wishlistRepository.save(any(Wishlist.class))).thenReturn(testWishlist);

        Wishlist wishlist = wishlistService.addToWishlist("user@test.com", "tour", 1L);

        assertNotNull(wishlist);
        assertEquals("tour", wishlist.getItemType());
        verify(wishlistRepository).save(any(Wishlist.class));
    }

    @Test
    void addToWishlist_Duplicate_ThrowsException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(wishlistRepository.existsByUserEmailAndItemTypeAndItemId(anyString(), anyString(), anyLong())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> wishlistService.addToWishlist("user@test.com", "tour", 1L));
        
        verify(wishlistRepository, never()).save(any(Wishlist.class));
    }
}