package com.vietjourney.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/*
 * Kiến trúc Stateless với JWT:
 * - Session truyền thống: server lưu trạng thái đăng nhập trong bộ nhớ/DB
 *   → không scale được khi chạy nhiều instance (load balancer không biết user
 *   đã login ở server nào)
 * - JWT (JSON Web Token): server KHÔNG lưu trạng thái. Token chứa toàn bộ
 *   thông tin user được ký bằng secret key. Mỗi request tự mang token,
 *   server chỉ cần verify chữ ký là xong.
 * → Phù hợp với kiến trúc microservices và horizontal scaling.
 */
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final LoginRateLimitFilter loginRateLimitFilter;
    private final VnpayIpnFilter vnpayIpnFilter;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Uses WebMvcConfig or specific Bean
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                    .requestMatchers("/api/tours/**", "/api/hotels/**", "/api/flights/**", "/api/search/**", "/api/blogs/**", "/api/reviews/**").permitAll()
                    .requestMatchers("/api/bookings/search").permitAll()
                    .requestMatchers("/api/payments/callback", "/api/payments/ipn").permitAll()
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // For swagger later
                    .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json;charset=UTF-8");
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write(
                        "{\"success\":false,\"message\":\"Bạn cần đăng nhập để thực hiện thao tác này.\",\"data\":null}"
                    );
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setContentType("application/json;charset=UTF-8");
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write(
                        "{\"success\":false,\"message\":\"Bạn không có quyền thực hiện thao tác này.\",\"data\":null}"
                    );
                })
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(vnpayIpnFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(loginRateLimitFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
