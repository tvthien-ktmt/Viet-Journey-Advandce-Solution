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
    private final org.springframework.data.redis.core.StringRedisTemplate redisTemplate;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new com.vietjourney.backend.exception.DuplicateResourceException("Email đã được sử dụng");
        }

        User user = new User();
        user.setFullName(com.vietjourney.backend.utils.HtmlSanitizer.sanitize(request.getFullName()));
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole("USER");

        userRepository.save(user);

        // Auto login after register
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(request.getEmail());
        loginRequest.setPassword(request.getPassword());
        return login(loginRequest);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            com.vietjourney.backend.security.CustomUserDetails userDetails = 
                (com.vietjourney.backend.security.CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            String token = jwtUtil.generateTokenFromUsername(user.getEmail(), user.getRole());
            String refreshTokenString = UUID.randomUUID().toString();
            
            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setToken(hashToken(refreshTokenString));
            refreshToken.setUser(user);
            refreshToken.setExpiresAt(LocalDateTime.now().plusDays(7));
            refreshTokenRepository.save(refreshToken);

            // Reset on success
            if (user.getFailedLoginCount() > 0) {
                user.setFailedLoginCount(0);
                user.setLockedUntil(null);
                userRepository.save(user);
            }
            
            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .phone(user.getPhone())
                    .role(user.getRole())
                    .lotusmilesTier(user.getLotusmilesTier())
                    .lotusmilesMiles(user.getLotusmilesMiles())
                    .build();

            return AuthResponse.builder()
                    .token(token)
                    .refreshToken(refreshTokenString)
                    .user(userDTO)
                    .build();
        } catch (org.springframework.security.authentication.LockedException ex) {
            throw new com.vietjourney.backend.exception.UnauthorizedActionException("Email hoặc mật khẩu không chính xác hoặc tài khoản bị khóa");
        } catch (org.springframework.security.core.AuthenticationException ex) {
            // Handle failed attempt tracking
            userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
                int failedAttempts = user.getFailedLoginCount() + 1;
                user.setFailedLoginCount(failedAttempts);
                if (failedAttempts >= 5) {
                    user.setLockedUntil(LocalDateTime.now().plusMinutes(15));
                }
                userRepository.save(user);
            });
            throw new com.vietjourney.backend.exception.UnauthorizedActionException("Email hoặc mật khẩu không chính xác hoặc tài khoản bị khóa");
        }
    }

    @Override
    public AuthResponse refreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndRevokedFalse(hashToken(token))
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
        String jwt = jwtUtil.generateTokenFromUsername(user.getEmail(), user.getRole());

        String newRefreshTokenString = UUID.randomUUID().toString();
        RefreshToken newRefreshToken = new RefreshToken();
        newRefreshToken.setUser(user);
        newRefreshToken.setToken(hashToken(newRefreshTokenString));
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
    public void logoutCurrentUser(String token) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            String email = authentication.getName();
            userRepository.findByEmail(email).ifPresent(user -> {
                refreshTokenRepository.deleteByUserId(user.getId());
            });
            
            if (token != null) {
                // Blacklist the token until it expires
                long expirationTime = jwtUtil.getExpirationTime(token) - System.currentTimeMillis();
                if (expirationTime > 0) {
                    redisTemplate.opsForValue().set(
                            "jwt_blacklist:" + token,
                            "revoked",
                            expirationTime,
                            java.util.concurrent.TimeUnit.MILLISECONDS
                    );
                }
            }
        }
    }

    private String hashToken(String token) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(hash);
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("Could not hash token", e);
        }
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
