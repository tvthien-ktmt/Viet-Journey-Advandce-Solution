package com.vietjourney.backend.service;

import com.vietjourney.backend.dto.request.BookingRequest;
import com.vietjourney.backend.entity.Booking;

import java.util.List;

public interface BookingService {
    Booking createReservation(BookingRequest request, String userEmail);
    Booking getBookingById(Long id);
    Booking confirmBooking(Long id);
    List<Booking> getUserBookings(String userEmail);
}
