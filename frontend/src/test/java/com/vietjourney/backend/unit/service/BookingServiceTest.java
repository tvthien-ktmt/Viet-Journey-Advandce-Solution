package com.vietjourney.backend.unit.service;

import com.vietjourney.backend.dto.request.BookingPassengerRequest;
import com.vietjourney.backend.dto.request.BookingRequest;
import com.vietjourney.backend.entity.Booking;
import com.vietjourney.backend.entity.Tour;
import com.vietjourney.backend.entity.User;
import com.vietjourney.backend.exception.BusinessException;
import com.vietjourney.backend.exception.ResourceNotFoundException;
import com.vietjourney.backend.repository.BookingRepository;
import com.vietjourney.backend.repository.FlightRepository;
import com.vietjourney.backend.repository.HotelRepository;
import com.vietjourney.backend.repository.TourRepository;
import com.vietjourney.backend.repository.UserRepository;
import com.vietjourney.backend.service.impl.BookingServiceImpl;
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

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TourRepository tourRepository;
    @Mock
    private HotelRepository hotelRepository;
    @Mock
    private FlightRepository flightRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User testUser;
    private Tour testTour;
    private BookingRequest bookingRequest;
    private Booking testBooking;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("user@test.com").build();
        testTour = Tour.builder().id(1L).price(100.0).build();

        BookingPassengerRequest passenger = new BookingPassengerRequest();
        passenger.setFullName("Passenger 1");
        passenger.setDocumentType("ID");
        passenger.setDocumentNumber("123456789");

        bookingRequest = new BookingRequest();
        bookingRequest.setItemType("tour");
        bookingRequest.setItemId(1L);
        bookingRequest.setPassengers(List.of(passenger));

        testBooking = Booking.builder()
                .id(1L)
                .user(testUser)
                .itemType("tour")
                .itemId(1L)
                .status("reserved")
                .reservedUntil(LocalDateTime.now().plusMinutes(10))
                .totalPrice(100.0)
                .build();
    }

    @Test
    void createBooking_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(tourRepository.findById(anyLong())).thenReturn(Optional.of(testTour));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Booking booking = bookingService.createBooking("user@test.com", bookingRequest);

        assertNotNull(booking);
        assertEquals("reserved", booking.getStatus());
        assertNotNull(booking.getReservedUntil());
        assertTrue(booking.getReservedUntil().isAfter(LocalDateTime.now().plusMinutes(9)));
        assertEquals(100.0, booking.getTotalPrice());

        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void createBooking_TourNotFound_ThrowsException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(tourRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> bookingService.createBooking("user@test.com", bookingRequest));
    }

    @Test
    void confirmBooking_AlreadyExpired_ThrowsException() {
        testBooking.setStatus("expired");
        when(bookingRepository.findById(anyLong())).thenReturn(Optional.of(testBooking));

        assertThrows(BusinessException.class, () -> bookingService.confirmBooking(1L));
    }
}