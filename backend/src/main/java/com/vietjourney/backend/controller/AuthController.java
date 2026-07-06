package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.request.LoginRequest;
import com.vietjourney.backend.dto.request.RegisterRequest;
import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.AuthResponse;
import com.vietjourney.backend.dto.response.UserDTO;
import com.vietjourney.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Đăng ký thành công"));
    }

    @Value("${app.jwt.expiration-ms:900000}")
    private long jwtExpirationMs;

    @Value("${app.cookie.secure:true}")
    private boolean cookieSecure;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        
        ResponseCookie cookie = ResponseCookie.from("jwt", authResponse.getToken())
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(jwtExpirationMs / 1000)
                .sameSite("Lax")
                .build();
                
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/api/auth/refresh")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .sameSite("Lax")
                .build();
                
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return ResponseEntity.ok(ApiResponse.success(authResponse, "Đăng nhập thành công"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(jakarta.servlet.http.HttpServletRequest request, HttpServletResponse response) {
        String token = extractJwtFromCookie(request);
        if (token != null) {
            authService.logoutCurrentUser(token);
        }
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
                
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/api/auth/refresh")
                .maxAge(0)
                .sameSite("Lax")
                .build();
                
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return ResponseEntity.ok(ApiResponse.success(null, "Đăng xuất thành công"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @CookieValue(value = "refresh_token", required = false) String cookieToken,
            @RequestBody(required = false) java.util.Map<String, String> request, 
            HttpServletResponse httpServletResponse) {
        
        String token = cookieToken;
        if (token == null && request != null) {
            token = request.get("refreshToken");
        }
        
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Refresh token is missing", null));
        }
        AuthResponse response = authService.refreshToken(token);
        
        ResponseCookie cookie = ResponseCookie.from("jwt", response.getToken())
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(jwtExpirationMs / 1000)
                .sameSite("Lax")
                .build();
                
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", response.getRefreshToken())
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/api/auth/refresh")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();
                
        httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return ResponseEntity.ok(ApiResponse.success(response, "Refresh token thành công"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser() {
        UserDTO user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user, "Lấy thông tin người dùng thành công"));
    }

    private String extractJwtFromCookie(jakarta.servlet.http.HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
