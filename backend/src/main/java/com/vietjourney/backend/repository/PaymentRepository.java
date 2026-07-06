package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionRef(String transactionRef);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(p.booking.totalPrice), 0) FROM Payment p WHERE p.status = 'completed' AND (:startDate IS NULL OR p.paidAt >= :startDate) AND (:endDate IS NULL OR p.paidAt <= :endDate)")
    java.math.BigDecimal sumRevenue(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate, @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate);
}
