package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    Optional<Tour> findBySlug(String slug);

    @Query(value = """
        SELECT * FROM tours t WHERE 
        (:query IS NULL OR :query = '' OR MATCH(t.name, t.location, t.overview) AGAINST (:query IN BOOLEAN MODE)) 
        AND (:minPrice IS NULL OR t.price >= :minPrice) 
        AND (:maxPrice IS NULL OR t.price <= :maxPrice) 
        AND (:location IS NULL OR :location = '' OR LOWER(t.location) LIKE LOWER(CONCAT('%', :location, '%')))
        """, 
        countQuery = """
        SELECT COUNT(*) FROM tours t WHERE 
        (:query IS NULL OR :query = '' OR MATCH(t.name, t.location, t.overview) AGAINST (:query IN BOOLEAN MODE)) 
        AND (:minPrice IS NULL OR t.price >= :minPrice) 
        AND (:maxPrice IS NULL OR t.price <= :maxPrice) 
        AND (:location IS NULL OR :location = '' OR LOWER(t.location) LIKE LOWER(CONCAT('%', :location, '%')))
        """, 
        nativeQuery = true)
    Page<Tour> searchToursFullText(@Param("query") String query, 
                           @Param("minPrice") BigDecimal minPrice, 
                           @Param("maxPrice") BigDecimal maxPrice, 
                           @Param("location") String location, 
                           Pageable pageable);

    @Query("SELECT t FROM Tour t WHERE " +
           "(:query IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.location) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:minPrice IS NULL OR t.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR t.price <= :maxPrice) " +
           "AND (:location IS NULL OR LOWER(t.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<Tour> searchToursLike(@Param("query") String query, 
                           @Param("minPrice") BigDecimal minPrice, 
                           @Param("maxPrice") BigDecimal maxPrice, 
                           @Param("location") String location, 
                           Pageable pageable);
}
