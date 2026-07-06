package com.vietjourney.backend.scheduler;

import com.vietjourney.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenCleanupScheduler {

    private final RefreshTokenRepository refreshTokenRepository;

    @Async
    @Scheduled(cron = "0 0 3 * * *") // Chạy lúc 3 giờ sáng mỗi ngày
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Starting expired refresh tokens cleanup...");
        refreshTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        log.info("Finished expired refresh tokens cleanup.");
    }
}
