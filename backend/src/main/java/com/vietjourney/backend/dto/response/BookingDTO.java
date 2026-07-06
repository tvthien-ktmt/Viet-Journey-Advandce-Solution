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
                .status(booking.getStatus())
                .totalPrice(booking.getTotalPrice())
                .reservedUntil(booking.getReservedUntil())
                .createdAt(booking.getCreatedAt())
                .passengers(passengerDTOs)
                .build();
    }
}
