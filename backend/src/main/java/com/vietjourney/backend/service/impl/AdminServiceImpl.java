package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.PaymentRepository;
import com.vietjourney.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Override
    @org.springframework.cache.annotation.Cacheable(value = "admin_stats")
    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", bookingRepository.count());
        
        java.math.BigDecimal revenue = paymentRepository.sumRevenue(null, null);
        stats.put("totalRevenue", revenue != null ? revenue.longValue() : 0);
        return stats;
    }
}
