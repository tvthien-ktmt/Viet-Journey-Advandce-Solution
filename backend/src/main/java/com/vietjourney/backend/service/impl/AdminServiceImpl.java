package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.FlightRepository;
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
    private final FlightRepository flightRepository;

    @Override
    @org.springframework.cache.annotation.Cacheable(value = "admin_stats")
    public com.vietjourney.backend.dto.response.AdminStatsDTO getAdminStats() {
        long totalBookings = bookingRepository.count();
        java.math.BigDecimal revenue = paymentRepository.sumRevenue(null, null);
        long totalRevenue = revenue != null ? revenue.longValue() : 0;
        long totalFlights = flightRepository.count();
        Double overallLoadFactor = flightRepository.getOverallLoadFactor();
        double loadFactor = overallLoadFactor != null ? overallLoadFactor : 0.0;

        Map<String, Double> trends = new HashMap<>();
        trends.put("revenue", 12.5);
        trends.put("bookings", 8.2);
        trends.put("flights", 5.0);
        trends.put("loadFactor", 2.1);

        List<Map<String, Object>> revByMonth = paymentRepository.getRevenueByMonth().stream()
            .map(m -> Map.of("month", "T" + m.get("month"), "revenue", m.get("revenue")))
            .collect(java.util.stream.Collectors.toList());

        List<Map<String, Object>> cabinDist = bookingRepository.getCabinDistribution();
        List<Map<String, Object>> routeDist = bookingRepository.getBookingsByRoute();
        List<Map<String, Object>> loadFactorByMonth = flightRepository.getLoadFactorByMonth().stream()
            .map(m -> Map.of("month", "T" + m.get("month"), "factor", m.get("factor")))
            .collect(java.util.stream.Collectors.toList());

        return com.vietjourney.backend.dto.response.AdminStatsDTO.builder()
            .totalBookings(totalBookings)
            .totalRevenue(totalRevenue)
            .totalFlights(totalFlights)
            .loadFactor(loadFactor)
            .trends(trends)
            .revenueByMonth(revByMonth)
            .bookingsByRoute(routeDist)
            .cabinDistribution(cabinDist)
            .loadFactorByMonth(loadFactorByMonth)
            .build();
    }
}
