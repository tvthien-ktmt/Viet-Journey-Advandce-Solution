package com.vietjourney.backend.scheduler;

import com.vietjourney.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationScheduler {

    private final BookingRepository bookingRepository;
    private final com.vietjourney.backend.service.strategy.booking.BookingStrategyFactory bookingStrategyFactory;

    // Chạy mỗi phút 1 lần
    @Async
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void releaseExpiredReservations() {
        java.util.List<com.vietjourney.backend.entity.Booking> expiredBookings = bookingRepository.findByStatusAndReservedUntilBefore(
                com.vietjourney.backend.entity.enums.BookingStatus.RESERVED, LocalDateTime.now());

        for (com.vietjourney.backend.entity.Booking booking : expiredBookings) {
            try {
                booking.transitionTo(com.vietjourney.backend.entity.enums.BookingStatus.EXPIRED);
                bookingRepository.save(booking);

                com.vietjourney.backend.service.strategy.booking.BookingItemStrategy strategy = bookingStrategyFactory.getStrategy(booking.getBookingType());
                int quantity = booking.getPassengers() != null && !booking.getPassengers().isEmpty() 
                        ? booking.getPassengers().size() 
                        : 1;
                strategy.release(booking.getReferenceId(), quantity);
                log.info("Released expired reservation: {}", booking.getId());
            } catch (Exception e) {
                log.error("Failed to release reservation {}: {}", booking.getId(), e.getMessage());
            }
        }
    }
}
