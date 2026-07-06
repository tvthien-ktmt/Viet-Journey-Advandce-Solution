package com.vietjourney.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.vietjourney.backend.entity.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "booking_type", nullable = false)
    private String bookingType; // 'tour', 'hotel', 'flight'

    @Column(name = "reference_id", nullable = false)
    private Long referenceId;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "reserved_until")
    private LocalDateTime reservedUntil;

    @Version
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookingPassenger> passengers;

    public void transitionTo(BookingStatus nextStatus) {
        if (this.status == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Cannot transition from terminal state: " + this.status);
        }
        if (this.status == BookingStatus.EXPIRED && nextStatus != BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Cannot transition from EXPIRED to anything other than CONFIRMED");
        }
        if (this.status == BookingStatus.CONFIRMED && nextStatus != BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Cannot change status of a confirmed booking");
        }
        this.status = nextStatus;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Booking)) return false;
        Booking other = (Booking) o;
        return id != null && id.equals(other.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
