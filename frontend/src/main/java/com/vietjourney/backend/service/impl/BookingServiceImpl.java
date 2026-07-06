package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.dto.request.BookingRequest;
import com.vietjourney.backend.entity.Booking;
import com.vietjourney.backend.entity.BookingPassenger;
import com.vietjourney.backend.entity.User;
import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.UserRepository;
import com.vietjourney.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Booking createReservation(BookingRequest request, String userEmail) {
        User user = null;
        if (userEmail != null) {
            user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Booking booking = Booking.builder()
                .user(user)
                .bookingType(request.getBookingType())
                .referenceId(request.getReferenceId())
                .status("reserved")
                .totalPrice(request.getTotalPrice())
                .reservedUntil(LocalDateTime.now().plusMinutes(10)) // Giữ chỗ 10 phút
                .build();

        if (request.getPassengers() != null) {
            List<BookingPassenger> passengers = request.getPassengers().stream()
                    .map(p -> BookingPassenger.builder()
                            .booking(booking)
                            .fullName(p.getFullName())
                            .email(p.getEmail())
                            .phone(p.getPhone())
                            .documentNumber(p.getDocumentNumber())
                            .build())
                    .collect(Collectors.toList());
            booking.setPassengers(passengers);
        }

        return bookingRepository.save(booking);
    }

    @Override
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Override
    @Transactional
    public Booking confirmBooking(Long id) {
        Booking booking = getBookingById(id);
        if ("expired".equals(booking.getStatus())) {
            throw new RuntimeException("Booking has expired");
        }
        booking.setStatus("confirmed");
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserId(user.getId());
    }
}
