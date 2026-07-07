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

        stats.put("totalFlights", 1250);
        stats.put("loadFactor", 86.5);
        Map<String, Double> trends = new HashMap<>();
        trends.put("revenue", 12.5);
        trends.put("bookings", 8.2);
        trends.put("flights", 5.0);
        trends.put("loadFactor", 2.1);
        stats.put("trends", trends);

        stats.put("revenueByMonth", java.util.Arrays.asList(
            Map.of("month", "T1", "revenue", 8500000000L),
            Map.of("month", "T2", "revenue", 9200000000L),
            Map.of("month", "T3", "revenue", 10500000000L),
            Map.of("month", "T4", "revenue", 11200000000L),
            Map.of("month", "T5", "revenue", 11800000000L),
            Map.of("month", "T6", "revenue", 12500000000L)
        ));

        stats.put("bookingsByRoute", java.util.Arrays.asList(
            Map.of("route", "HAN-SGN", "count", 1250),
            Map.of("route", "HAN-DAD", "count", 850),
            Map.of("route", "SGN-PQC", "count", 620),
            Map.of("route", "HAN-CXR", "count", 480),
            Map.of("route", "SGN-DAD", "count", 420)
        ));

        stats.put("cabinDistribution", java.util.Arrays.asList(
            Map.of("name", "Phổ thông", "value", 65),
            Map.of("name", "Phổ thông ĐB", "value", 15),
            Map.of("name", "Thương gia", "value", 20)
        ));

        stats.put("loadFactorByMonth", java.util.Arrays.asList(
            Map.of("month", "T1", "factor", 78.5),
            Map.of("month", "T2", "factor", 80.2),
            Map.of("month", "T3", "factor", 82.5),
            Map.of("month", "T4", "factor", 85.0),
            Map.of("month", "T5", "factor", 86.1),
            Map.of("month", "T6", "factor", 86.5)
        ));

        return stats;
    }
}
