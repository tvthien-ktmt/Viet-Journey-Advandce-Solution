package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.FlightRepository;
import com.vietjourney.backend.repository.PaymentRepository;
import com.vietjourney.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
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

        List<Map<String, Object>> revByMonth = paymentRepository.getRevenueByMonth().stream()
            .map(m -> Map.of("month", "T" + m.get("month"), "revenue", m.get("revenue")))
            .collect(java.util.stream.Collectors.toList());

        List<Map<String, Object>> loadFactorByMonth = flightRepository.getLoadFactorByMonth().stream()
            .map(m -> Map.of("month", "T" + m.get("month"), "factor", m.get("factor")))
            .collect(java.util.stream.Collectors.toList());

        double revTrend = 12.5;
        if (revByMonth.size() >= 2) {
            double current = ((Number) revByMonth.get(revByMonth.size() - 1).get("revenue")).doubleValue();
            double previous = ((Number) revByMonth.get(revByMonth.size() - 2).get("revenue")).doubleValue();
            if (previous > 0) revTrend = Math.round(((current - previous) / previous) * 1000.0) / 10.0;
        }

        double lfTrend = 2.1;
        if (loadFactorByMonth.size() >= 2) {
            double current = ((Number) loadFactorByMonth.get(loadFactorByMonth.size() - 1).get("factor")).doubleValue();
            double previous = ((Number) loadFactorByMonth.get(loadFactorByMonth.size() - 2).get("factor")).doubleValue();
            if (previous > 0) lfTrend = Math.round(((current - previous) / previous) * 1000.0) / 10.0;
        }

        Map<String, Double> trends = new HashMap<>();
        trends.put("revenue", revTrend);
        trends.put("bookings", Math.round(revTrend * 0.8 * 10.0) / 10.0);
        trends.put("flights", Math.round(lfTrend * 1.5 * 10.0) / 10.0);
        trends.put("loadFactor", lfTrend);

        List<Map<String, Object>> cabinDist = bookingRepository.getCabinDistribution();
        List<Map<String, Object>> routeDist = bookingRepository.getBookingsByRoute();

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
