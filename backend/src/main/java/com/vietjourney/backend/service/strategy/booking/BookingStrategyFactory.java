package com.vietjourney.backend.service.strategy.booking;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.HashMap;

@Component
public class BookingStrategyFactory {

    private final Map<String, BookingItemStrategy> strategies = new HashMap<>();

    public BookingStrategyFactory(
            TourBookingStrategy tourBookingStrategy,
            FlightBookingStrategy flightBookingStrategy,
            HotelBookingStrategy hotelBookingStrategy) {
        strategies.put("tour", tourBookingStrategy);
        strategies.put("flight", flightBookingStrategy);
        strategies.put("hotel", hotelBookingStrategy);
    }

    public BookingItemStrategy getStrategy(String bookingType) {
        BookingItemStrategy strategy = strategies.get(bookingType.toLowerCase());
        if (strategy == null) {
            throw new com.vietjourney.backend.exception.BusinessException("Invalid booking type: " + bookingType);
        }
        return strategy;
    }
}
