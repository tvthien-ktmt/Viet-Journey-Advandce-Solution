package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.dto.request.LoginRequest;
import com.vietjourney.backend.dto.request.RegisterRequest;
import com.vietjourney.backend.dto.response.AuthResponse;
import com.vietjourney.backend.dto.response.UserDTO;
import com.vietjourney.backend.entity.User;
import com.vietjourney.backend.repository.UserRepository;
import com.vietjourney.backend.security.JwtUtil;
import com.vietjourney.backend.service.AuthService;
import com.vietjourney.backend.entity.RefreshToken;
import com.vietjourney.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/*
 * Tại sao BCrypt thay vì MD5/SHA256?
 * - MD5/SHA256 là hàm hash nhanh → attacker có thể brute-force hàng tỷ
 *   hash/giây bằng GPU
 * - BCrypt có "cost factor" (rounds) làm chậm quá trình hash có chủ ý,
 *   mặc định 10 rounds = ~100ms/hash → brute-force mất hàng chục năm
 * - BCrypt tự động thêm "salt" ngẫu nhiên → 2 user cùng password sẽ có
 *   hash khác nhau → chống rainbow table attack
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new com.vietjourney.backend.exception.DuplicateResourceException("Email đã được sử dụng");
        }

        User user = User.builder()
                .fullName(com.vietjourney.backend.utils.HtmlSanitizer.sanitize(request.getFullName()))
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role("USER")
                .build();

        userRepository.save(user);

        // Auto login after register
        return authenticate(request.getEmail(), request.getPassword(), user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.vietjourney.backend.exception.UnauthorizedActionException("Email hoặc mật khẩu không chính xác"));

        return authenticate(request.getEmail(), request.getPassword(), user);
    }

    @Override
    public AuthResponse refreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndRevokedFalse(token)
                .orElseThrow(() -> new com.vietjourney.backend.exception.UnauthorizedActionException("Refresh token không hợp lệ hoặc đã bị thu hồi"));

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new com.vietjourney.backend.exception.UnauthorizedActionException("Refresh token đã hết hạn");
        }

        // Rotate token
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        User user = refreshToken.getUser();
        String jwt = jwtUtil.generateTokenFromUsername(user.getEmail());

        String newRefreshTokenString = UUID.randomUUID().toString();
        RefreshToken newRefreshToken = new RefreshToken();
        newRefreshToken.setUser(user);
        newRefreshToken.setToken(newRefreshTokenString);
        newRefreshToken.setExpiresAt(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(newRefreshToken);

        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(newRefreshTokenString)
                .user(mapToUserDTO(user))
                .build();
    }

    @Override
    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new com.vietjourney.backend.exception.UnauthorizedActionException("User not authenticated");
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("User not found"));
                
        return mapToUserDTO(user);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void logoutCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            String email = authentication.getName();
            userRepository.findByEmail(email).ifPresent(user -> {
                refreshTokenRepository.deleteByUserId(user.getId());
            });
        }
    }

    private AuthResponse authenticate(String email, String password, User user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);

        String refreshTokenString = UUID.randomUUID().toString();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(refreshTokenString);
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(7)); // 7 days
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(refreshTokenString)
                .user(mapToUserDTO(user))
                .build();
    }

    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .lotusmilesTier(user.getLotusmilesTier())
                .lotusmilesMiles(user.getLotusmilesMiles())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
