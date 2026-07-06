package com.vietjourney.backend.service;

import com.vietjourney.backend.dto.request.BookingRequest;
import com.vietjourney.backend.entity.Booking;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.vietjourney.backend.dto.response.BookingDTO;

public interface BookingService {
    BookingDTO createReservation(BookingRequest request, String userEmail);
    BookingDTO getBookingById(Long id);
    BookingDTO getBookingByIdAndUser(Long id, String userEmail);
    BookingDTO confirmBooking(Long id);
    Page<BookingDTO> getUserBookings(String userEmail, Pageable pageable);
    BookingDTO searchByCodeAndLastName(String bookingCode, String lastName);
}
