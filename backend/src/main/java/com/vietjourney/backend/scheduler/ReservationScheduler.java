package com.vietjourney.backend.scheduler;

import com.vietjourney.backend.entity.enums.BookingStatus;
import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.service.ReservationReleaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationScheduler {

    private final BookingRepository bookingRepository;
    private final ReservationReleaseService reservationReleaseService;

    // Chạy mỗi phút 1 lần
    @Scheduled(cron = "0 * * * * *")
    public void releaseExpiredReservations() {
        java.util.List<com.vietjourney.backend.entity.Booking> expiredBookings =
                bookingRepository.findByStatusAndReservedUntilBefore(BookingStatus.RESERVED, LocalDateTime.now());

        for (com.vietjourney.backend.entity.Booking booking : expiredBookings) {
            try {
                // Each booking released in its own REQUIRES_NEW transaction — 
                // failure of one booking does not roll back others
                reservationReleaseService.releaseExpiredBooking(booking);
            } catch (Exception e) {
                log.error("Failed to release reservation {}: {}", booking.getId(), e.getMessage());
            }
        }
    }
}
