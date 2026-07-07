package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AdminStatsDTO {
    private long totalBookings;
    private long totalRevenue;
    private long totalFlights;
    private double loadFactor;
    private Map<String, Double> trends;
    private List<Map<String, Object>> revenueByMonth;
    private List<Map<String, Object>> bookingsByRoute;
    private List<Map<String, Object>> cabinDistribution;
    private List<Map<String, Object>> loadFactorByMonth;
}
