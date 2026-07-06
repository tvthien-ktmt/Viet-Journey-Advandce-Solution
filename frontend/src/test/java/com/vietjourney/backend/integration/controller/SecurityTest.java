package com.vietjourney.backend.integration.controller;

import com.vietjourney.backend.controller.BookingController;
import com.vietjourney.backend.security.JwtService;
import com.vietjourney.backend.service.BookingService;
import com.vietjourney.backend.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Import SecurityConfig for standard filter chain mapping
@WebMvcTest(controllers = BookingController.class)
public class SecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookingService bookingService;
    
    @MockBean
    private PaymentService paymentService;

    @MockBean
    private JwtService jwtService;

    @Test
    @WithAnonymousUser
    void requestWithoutToken_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/bookings/my-bookings"))
                .andExpect(status().isUnauthorized()); // Should be 401 Unauthorized
    }
}