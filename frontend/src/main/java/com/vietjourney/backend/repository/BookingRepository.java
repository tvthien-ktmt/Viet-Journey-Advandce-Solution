package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Modifying
    @Query("UPDATE Booking b SET b.status = 'expired' WHERE b.status = 'reserved' AND b.reservedUntil < :now")
    int expireReservations(LocalDateTime now);

    List<Booking> findByUserId(Long userId);
}
