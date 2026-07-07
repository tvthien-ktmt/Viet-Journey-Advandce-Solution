package com.vietjourney.backend.service;

import com.vietjourney.backend.entity.Booking;
import com.vietjourney.backend.entity.enums.BookingStatus;
import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.service.strategy.booking.BookingStrategyFactory;
import com.vietjourney.backend.service.strategy.booking.BookingItemStrategy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationReleaseService {

    private final BookingRepository bookingRepository;
    private final BookingStrategyFactory bookingStrategyFactory;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void releaseExpiredBooking(Booking booking) {
        booking.transitionTo(BookingStatus.EXPIRED);
        bookingRepository.save(booking);

        BookingItemStrategy strategy = bookingStrategyFactory.getStrategy(booking.getBookingType());
        int quantity = booking.getPassengers() != null ? booking.getPassengers().size() : 1;
        strategy.release(booking.getReferenceId(), quantity);
        log.info("Released expired reservation: {}", booking.getId());
    }
}
