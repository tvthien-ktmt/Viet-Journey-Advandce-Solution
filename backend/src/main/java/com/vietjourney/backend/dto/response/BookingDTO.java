package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.vietjourney.backend.entity.Booking;

@Data
@Builder
public class BookingDTO {
    private Long id;
    private UserSummaryDTO user;
    private String bookingType;
    private Long referenceId;
    private String status;
    private BigDecimal totalPrice;
    private LocalDateTime reservedUntil;
    private LocalDateTime createdAt;
    private List<BookingPassengerDTO> passengers;

    @Data
    @Builder
    public static class BookingPassengerDTO {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String documentNumber;
    }

    public static BookingDTO fromEntity(Booking booking) {
        UserSummaryDTO userDto = null;
        if (booking.getUser() != null) {
            userDto = UserSummaryDTO.builder()
                    .id(booking.getUser().getId())
                    .fullName(booking.getUser().getFullName())
                    .email(booking.getUser().getEmail())
                    .build();
        }

        List<BookingPassengerDTO> passengerDTOs = null;
        if (booking.getPassengers() != null) {
            passengerDTOs = booking.getPassengers().stream()
                    .map(p -> BookingPassengerDTO.builder()
                            .id(p.getId())
                            .fullName(p.getFullName())
                            .email(p.getEmail())
                            .phone(p.getPhone())
                            .documentNumber(p.getDocumentNumber())
                            .build())
                    .collect(Collectors.toList());
        }

        return BookingDTO.builder()
                .id(booking.getId())
                .user(userDto)
                .bookingType(booking.getBookingType())
                .referenceId(booking.getReferenceId())
                .status(booking.getStatus() != null ? booking.getStatus().name() : null)
                .totalPrice(booking.getTotalPrice())
                .reservedUntil(booking.getReservedUntil())
                .createdAt(booking.getCreatedAt())
                .passengers(passengerDTOs)
                .build();
    }

    public void maskPII() {
        if (this.user != null) {
            this.user.setEmail(maskEmail(this.user.getEmail()));
        }
        if (this.passengers != null) {
            for (BookingPassengerDTO p : this.passengers) {
                p.setEmail(maskEmail(p.getEmail()));
                p.setPhone(maskPhone(p.getPhone()));
                p.setDocumentNumber(maskDocument(p.getDocumentNumber()));
            }
        }
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        String[] parts = email.split("@");
        String name = parts[0];
        if (name.length() <= 2) return "***@" + parts[1];
        return name.substring(0, 2) + "***@" + parts[1];
    }
    
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return phone;
        return "***" + phone.substring(phone.length() - 4);
    }
    
    private String maskDocument(String doc) {
        if (doc == null || doc.length() < 4) return doc;
        return "***" + doc.substring(doc.length() - 4);
    }
}
