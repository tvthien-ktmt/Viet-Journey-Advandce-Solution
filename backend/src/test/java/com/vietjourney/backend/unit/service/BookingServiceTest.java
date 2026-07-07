package com.vietjourney.backend.unit.service;

import com.vietjourney.backend.dto.request.BookingRequest;
import com.vietjourney.backend.dto.request.PassengerRequest;
import com.vietjourney.backend.entity.Booking;
import com.vietjourney.backend.entity.Tour;
import com.vietjourney.backend.entity.User;
import com.vietjourney.backend.entity.enums.BookingStatus;
import com.vietjourney.backend.exception.BusinessException;
import com.vietjourney.backend.exception.ResourceNotFoundException;
import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.UserRepository;
import com.vietjourney.backend.service.impl.BookingServiceImpl;
import com.vietjourney.backend.service.strategy.booking.BookingItemStrategy;
import com.vietjourney.backend.service.strategy.booking.BookingStrategyFactory;
import com.vietjourney.backend.dto.response.BookingDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BookingStrategyFactory bookingStrategyFactory;
    @Mock
    private BookingItemStrategy bookingItemStrategy;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User testUser;
    private Tour testTour;
    private BookingRequest bookingRequest;
    private Booking testBooking;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("user@test.com");
        
        testTour = new Tour();
        testTour.setId(1L);
        testTour.setPrice(new BigDecimal("100.0"));

        PassengerRequest passenger = new PassengerRequest();
        passenger.setFullName("Passenger 1");
        passenger.setIdNumber("123456789");

        bookingRequest = new BookingRequest();
        bookingRequest.setBookingType("tour");
        bookingRequest.setReferenceId(1L);
        bookingRequest.setPassengers(List.of(passenger));

        testBooking = new Booking();
        testBooking.setId(1L);
        testBooking.setUser(testUser);
        testBooking.setBookingType("tour");
        testBooking.setReferenceId(1L);
        testBooking.setStatus(BookingStatus.RESERVED);
        testBooking.setReservedUntil(LocalDateTime.now().plusMinutes(10));
        testBooking.setTotalPrice(new BigDecimal("100.0"));
    }

    @Test
    void createBooking_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(bookingStrategyFactory.getStrategy(anyString())).thenReturn(bookingItemStrategy);
        when(bookingItemStrategy.getUnitPrice(anyLong())).thenReturn(new BigDecimal("100.0"));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingDTO booking = bookingService.createReservation(bookingRequest, "user@test.com");

        assertNotNull(booking);
        assertEquals(BookingStatus.RESERVED.name(), booking.getStatus());
        assertNotNull(booking.getReservedUntil());
        assertTrue(booking.getReservedUntil().isAfter(LocalDateTime.now().plusMinutes(9)));
        assertEquals(new BigDecimal("100.0"), booking.getTotalPrice());

        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void createBooking_TourNotFound_ThrowsException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(bookingStrategyFactory.getStrategy(anyString())).thenReturn(bookingItemStrategy);
        when(bookingItemStrategy.getUnitPrice(anyLong())).thenThrow(new ResourceNotFoundException("Tour not found"));

        assertThrows(ResourceNotFoundException.class, () -> bookingService.createReservation(bookingRequest, "user@test.com"));
    }

    @Test
    void confirmBooking_AlreadyExpired_ThrowsException() {
        testBooking.setStatus(BookingStatus.EXPIRED);
        when(bookingRepository.findById(anyLong())).thenReturn(Optional.of(testBooking));

        assertThrows(BusinessException.class, () -> bookingService.confirmBooking(1L));
    }
}
