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
    private String itemSnapshot;
    private String contactEmail;
    private String contactPhone;
    private List<BookingPassengerDTO> passengers;

    @Data
    @Builder
    public static class BookingPassengerDTO {
        private Long id;
        private String fullName;
        private String documentNumber;
        private String type;
        private String birthDate;
        private String gender;
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
                            .fullName(p.getFullName())
                            .documentNumber(p.getDocumentNumber())
                            .type(p.getType())
                            .birthDate(p.getBirthDate())
                            .gender(p.getGender())
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
                .createdAt(booking.getCreatedAt())
                .itemSnapshot(booking.getItemSnapshot())
                .contactEmail(booking.getContactEmail())
                .contactPhone(booking.getContactPhone())
                .passengers(passengerDTOs)
                .build();
    }

    public void maskPII() {
        if (this.user != null) {
            this.user.setEmail(maskEmail(this.user.getEmail()));
        }
        if (this.contactEmail != null) {
            this.contactEmail = maskEmail(this.contactEmail);
        }
        if (this.contactPhone != null) {
            this.contactPhone = maskPhone(this.contactPhone);
        }
        if (this.passengers != null) {
            for (BookingPassengerDTO p : this.passengers) {
                // mask documentNumber if needed
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
