package com.vietjourney.backend.service;

import com.vietjourney.backend.dto.request.BookingRequest;
import com.vietjourney.backend.entity.Booking;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    Booking createReservation(BookingRequest request, String userEmail);
    Booking getBookingById(Long id);
    Booking getBookingByIdAndUser(Long id, String userEmail);
    Booking confirmBooking(Long id);
    Page<Booking> getUserBookings(String userEmail, Pageable pageable);
    Booking searchByCodeAndLastName(String bookingCode, String lastName);
}
