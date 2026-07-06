package com.vietjourney.backend.service.strategy.booking;

import com.vietjourney.backend.entity.Tour;
import com.vietjourney.backend.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component("tourBookingStrategy")
@RequiredArgsConstructor
public class TourBookingStrategy implements BookingItemStrategy {

    private final TourRepository tourRepository;

    @Override
    public BigDecimal getUnitPrice(Long referenceId) {
        Tour tour = tourRepository.findById(referenceId)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Tour not found"));
        return tour.getPrice();
    }

    @Override
    public void validateAndReserve(Long referenceId, int quantity) {
        if (!tourRepository.existsById(referenceId)) {
            throw new com.vietjourney.backend.exception.ResourceNotFoundException("Tour not found");
        }
    }
}
