package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    Optional<Hotel> findBySlug(String slug);

    @Query("SELECT h FROM Hotel h WHERE " +
           "(:query IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(h.location) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:minPrice IS NULL OR h.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR h.price <= :maxPrice) " +
           "AND (:location IS NULL OR LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<Hotel> searchHotels(@Param("query") String query, 
                             @Param("minPrice") BigDecimal minPrice, 
                             @Param("maxPrice") BigDecimal maxPrice, 
                             @Param("location") String location, 
                             Pageable pageable);
}
