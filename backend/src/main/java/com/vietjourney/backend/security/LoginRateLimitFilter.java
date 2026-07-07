package com.vietjourney.backend.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;


import org.springframework.stereotype.Component;

@Component
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private final Cache<String, Bucket> cache = Caffeine.newBuilder()
            .expireAfterAccess(Duration.ofMinutes(15))
            .maximumSize(10000)
            .build();

    private Bucket createNewBucket() {
        // 5 requests per 5 minutes
        Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(5)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createBookingBucket() {
        // 5 requests per 10 minutes for booking
        Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(10)));
        return Bucket.builder().addLimit(limit).build();
    }

    private String getClientIP(HttpServletRequest request) {
        // To prevent X-Forwarded-For spoofing, we use the direct connection IP.
        // If we are behind a reverse proxy (e.g., Nginx, Cloudflare), we should configure Tomcat 
        // with RemoteIpValve and still use getRemoteAddr(), rather than manually parsing headers here.
        return request.getRemoteAddr();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String uri = request.getRequestURI();
        String method = request.getMethod();
        
        if ((uri.equals("/api/auth/login") || uri.equals("/api/auth/register")) && method.equalsIgnoreCase("POST")) {
            String ip = getClientIP(request);
            Bucket bucket = cache.get("auth_" + ip, k -> createNewBucket());
            
            if (bucket != null && bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(429);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"success\":false,\"message\":\"Too many attempts. Please try again later.\"}");
            }
        } else if (uri.equals("/api/bookings") && method.equalsIgnoreCase("POST")) {
            String ip = getClientIP(request);
            Bucket bucket = cache.get("booking_" + ip, k -> createBookingBucket());
            
            if (bucket != null && bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(429);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"success\":false,\"message\":\"Too many booking attempts. Please try again later.\"}");
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }
}
