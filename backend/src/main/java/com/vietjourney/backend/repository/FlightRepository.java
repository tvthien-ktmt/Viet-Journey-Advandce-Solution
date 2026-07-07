package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Flight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    @Query("SELECT f FROM Flight f WHERE " +
           "(:departureAirport IS NULL OR f.departureAirport = :departureAirport) " +
           "AND (:arrivalAirport IS NULL OR f.arrivalAirport = :arrivalAirport) " +
           "AND (:departureTime IS NULL OR f.departureTime >= :departureTime)")
    Page<Flight> searchFlights(@Param("departureAirport") String departureAirport, 
                               @Param("arrivalAirport") String arrivalAirport, 
                               @Param("departureTime") LocalDateTime departureTime, 
                               Pageable pageable);

    List<Flight> findByDepartureAirportAndArrivalAirportAndDepartureTimeBetween(
            String departureAirport, String arrivalAirport, LocalDateTime start, LocalDateTime end);

    @Query("SELECT new map(FUNCTION('MONTH', f.departureTime) as month, AVG((f.totalSeats - f.availableSeats) * 1.0 / f.totalSeats) * 100 as factor) FROM Flight f GROUP BY FUNCTION('MONTH', f.departureTime) ORDER BY month")
    List<Map<String, Object>> getLoadFactorByMonth();

    @Query("SELECT AVG((f.totalSeats - f.availableSeats) * 1.0 / f.totalSeats) * 100 FROM Flight f")
    Double getOverallLoadFactor();

    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Flight f SET f.availableSeats = f.availableSeats - :qty WHERE f.id = :id AND f.availableSeats >= :qty")
    int decrementAvailableSeats(@Param("id") Long id, @Param("qty") int qty);

    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Flight f SET f.availableSeats = f.availableSeats + :qty WHERE f.id = :id")
    int incrementAvailableSeats(@Param("id") Long id, @Param("qty") int qty);
}
