package com.vietjourney.backend.service.strategy.booking;

import com.vietjourney.backend.entity.Hotel;
import com.vietjourney.backend.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component("hotelBookingStrategy")
@RequiredArgsConstructor
public class HotelBookingStrategy implements BookingItemStrategy {

    private final HotelRepository hotelRepository;

    @Override
    public BigDecimal getUnitPrice(Long referenceId) {
        Hotel hotel = hotelRepository.findById(referenceId)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Hotel not found"));
        return hotel.getPrice();
    }
}
