package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // NOTE: expireReservations(@Modifying bulk-update) was removed — use ReservationReleaseService instead
    //       which processes each booking individually in REQUIRES_NEW transactions.
    List<Booking> findByStatusAndReservedUntilBefore(com.vietjourney.backend.entity.enums.BookingStatus status, LocalDateTime now);

    @EntityGraph(attributePaths = {"user", "passengers"})
    @Query("SELECT b FROM Booking b JOIN b.passengers p WHERE b.id = :id AND LOWER(p.fullName) LIKE LOWER(CONCAT('%', :lastName))")
    List<Booking> findByIdAndPassengerLastName(Long id, String lastName);

    @EntityGraph(attributePaths = {"user", "passengers"})
    List<Booking> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user", "passengers"})
    Page<Booking> findByUserId(Long userId, Pageable pageable);

    long countByUserIdAndStatusIn(Long userId, List<com.vietjourney.backend.entity.enums.BookingStatus> statuses);
}
