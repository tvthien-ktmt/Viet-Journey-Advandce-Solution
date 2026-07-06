package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Modifying
    @Query("UPDATE Booking b SET b.status = 'expired' WHERE b.status = 'reserved' AND b.reservedUntil < :now")
    int expireReservations(LocalDateTime now);

    @EntityGraph(attributePaths = {"user", "passengers"})
    @Query("SELECT b FROM Booking b JOIN b.passengers p WHERE b.id = :id AND LOWER(p.fullName) LIKE LOWER(CONCAT('%', :lastName))")
    List<Booking> findByIdAndPassengerLastName(Long id, String lastName);

    @EntityGraph(attributePaths = {"user", "passengers"})
    List<Booking> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user", "passengers"})
    Page<Booking> findByUserId(Long userId, Pageable pageable);
}
