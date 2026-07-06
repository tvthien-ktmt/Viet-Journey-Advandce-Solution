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

    // Chạy mỗi phút 1 lần
    @Async
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void releaseExpiredReservations() {
        int updatedCount = bookingRepository.expireReservations(LocalDateTime.now());
        if (updatedCount > 0) {
            log.info("Released {} expired reservations.", updatedCount);
        }
    }
}
