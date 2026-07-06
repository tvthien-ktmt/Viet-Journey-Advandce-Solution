package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.dto.request.BookingRequest;
import com.vietjourney.backend.dto.response.BookingDTO;
import com.vietjourney.backend.entity.Booking;
import com.vietjourney.backend.entity.enums.BookingStatus;
import com.vietjourney.backend.entity.BookingPassenger;
import com.vietjourney.backend.entity.User;
import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.UserRepository;
import com.vietjourney.backend.service.BookingService;
import com.vietjourney.backend.service.strategy.booking.BookingStrategyFactory;
import com.vietjourney.backend.service.strategy.booking.BookingItemStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final BookingStrategyFactory bookingStrategyFactory;

    @Override
    @Transactional
    public BookingDTO createReservation(BookingRequest request, String userEmail) {
        User user = null;
        if (userEmail != null) {
            user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("User not found"));
        }

        BookingItemStrategy strategy = bookingStrategyFactory.getStrategy(request.getBookingType());
        BigDecimal unitPrice = strategy.getUnitPrice(request.getReferenceId());

        int quantity = request.getPassengers() != null && !request.getPassengers().isEmpty() 
                ? request.getPassengers().size() 
                : 1;

        strategy.validateAndReserve(request.getReferenceId(), quantity);

        BigDecimal calculatedTotalPrice = unitPrice.multiply(new BigDecimal(quantity));

        Booking booking = Booking.builder()
                .user(user)
                .bookingType(request.getBookingType())
                .referenceId(request.getReferenceId())
                .status(BookingStatus.RESERVED)
                .totalPrice(calculatedTotalPrice)
                .reservedUntil(LocalDateTime.now().plusMinutes(10)) // Giữ chỗ 10 phút
                .build();

        if (request.getPassengers() != null) {
            List<BookingPassenger> passengers = request.getPassengers().stream()
                    .map(p -> BookingPassenger.builder()
                            .booking(booking)
                            .fullName(com.vietjourney.backend.utils.HtmlSanitizer.sanitize(p.getFullName()))
                            .email(p.getEmail())
                            .phone(p.getPhone())
                            .documentNumber(p.getDocumentNumber())
                            .build())
                    .collect(Collectors.toList());
            booking.setPassengers(passengers);
        }

        Booking savedBooking = bookingRepository.save(booking);
        return BookingDTO.fromEntity(savedBooking);
    }

    private Booking getBookingEntityById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Booking not found"));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public BookingDTO getBookingById(Long id) {
        return BookingDTO.fromEntity(getBookingEntityById(id));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public BookingDTO getBookingByIdAndUser(Long id, String userEmail) {
        Booking booking = getBookingEntityById(id);
        if (booking.getUser() != null && !booking.getUser().getEmail().equals(userEmail)) {
            throw new org.springframework.security.access.AccessDeniedException("Bạn không có quyền truy cập booking này");
        }
        return BookingDTO.fromEntity(booking);
    }

    @Override
    @Transactional
    public BookingDTO confirmBooking(Long id) {
        Booking booking = getBookingEntityById(id);
        if (booking.getStatus() == BookingStatus.EXPIRED) {
            throw new com.vietjourney.backend.exception.BusinessException("Booking đã hết hạn", 400);
        }
        booking.transitionTo(BookingStatus.CONFIRMED);
        return BookingDTO.fromEntity(bookingRepository.save(booking));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Page<BookingDTO> getUserBookings(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserId(user.getId(), pageable).map(BookingDTO::fromEntity);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public BookingDTO searchByCodeAndLastName(String bookingCode, String lastName) {
        try {
            String idStr = bookingCode.toUpperCase().replace("BK", "");
            Long id = Long.parseLong(idStr);
            List<Booking> bookings = bookingRepository.findByIdAndPassengerLastName(id, lastName);
            if (bookings.isEmpty()) {
                throw new com.vietjourney.backend.exception.ResourceNotFoundException("Không tìm thấy đặt chỗ phù hợp");
            }
            return BookingDTO.fromEntity(bookings.get(0));
        } catch (NumberFormatException e) {
            throw new com.vietjourney.backend.exception.ResourceNotFoundException("Mã đặt chỗ không hợp lệ");
        }
    }
}
