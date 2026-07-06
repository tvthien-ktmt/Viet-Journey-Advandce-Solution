package com.vietjourney.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class VnpayIpnFilter extends OncePerRequestFilter {

    private final List<String> vnpayIps = Arrays.asList(
            "113.160.92.202", "113.160.92.203", "113.160.92.204", "113.160.92.205",
            "113.160.92.206", "113.160.92.207", "113.160.92.208", "113.160.92.209",
            "113.160.92.210", "113.160.92.211", "113.160.92.212", "113.160.92.213",
            "113.160.92.214", "113.160.92.215", "113.160.92.216", "113.160.92.217",
            "113.160.92.218", "113.160.92.219", "113.160.92.220", "113.160.92.221",
            "113.160.92.222", "113.160.92.223", "113.160.92.224", "113.160.92.225",
            "113.160.92.226", "113.160.92.227", "113.160.92.228", "113.160.92.229",
            "113.160.92.230", "113.160.92.231", "113.160.92.232", "113.160.92.233",
            "113.160.92.234", "113.160.92.235", "113.160.92.236", "113.160.92.237",
            "113.160.92.238", "113.160.92.239", "113.160.92.240", "113.160.92.241",
            "113.160.92.242", "113.160.92.243", "113.160.92.244", "113.160.92.245",
            "113.160.92.246", "113.160.92.247", "113.160.92.248", "113.160.92.249",
            "113.160.92.250", "113.160.92.251", "113.160.92.252", "113.160.92.253",
            "113.160.92.254", "113.160.92.255"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        if (request.getRequestURI().equals("/api/payments/ipn")) {
            String ip = request.getRemoteAddr();
            if (!vnpayIps.contains(ip) && !ip.equals("127.0.0.1") && !ip.equals("0:0:0:0:0:0:0:1")) {
                response.setStatus(403);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"success\":false,\"message\":\"Access denied from this IP.\"}");
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
