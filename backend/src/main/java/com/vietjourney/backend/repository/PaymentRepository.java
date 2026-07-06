package com.vietjourney.backend.repository;

import com.vietjourney.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionRef(String transactionRef);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(p.booking.totalPrice), 0) FROM Payment p WHERE p.status = 'completed'")
    java.math.BigDecimal sumRevenue();
}
