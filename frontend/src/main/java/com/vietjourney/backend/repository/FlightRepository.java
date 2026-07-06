package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Flight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

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
}
