package com.vietjourney.backend.integration.controller;

import com.vietjourney.backend.controller.TourController;
import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.TourDTO;
import com.vietjourney.backend.entity.Tour;
import com.vietjourney.backend.security.JwtAuthenticationFilter;
import com.vietjourney.backend.security.JwtUtil;
import com.vietjourney.backend.service.TourService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = TourController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TourControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TourService tourService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void getAllTours_ReturnsPageResponse() throws Exception {
        Tour tour = new Tour();
        tour.setId(1L);
        tour.setName("Test Tour");
        tour.setPrice(new BigDecimal("100.0"));
        Page<Tour> pageResponse = new PageImpl<>(List.of(tour), PageRequest.of(0, 10), 1);

        when(tourService.searchTours(any(), any(), any(), any(), any())).thenReturn(pageResponse);

        mockMvc.perform(get("/api/tours")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].name").value("Test Tour"))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    void getTourById_ValidId_ReturnsTour() throws Exception {
        Tour tour = new Tour();
        tour.setId(1L);
        tour.setName("Test Tour");
        tour.setPrice(new BigDecimal("100.0"));

        when(tourService.getTourById(anyLong())).thenReturn(tour);

        mockMvc.perform(get("/api/tours/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Test Tour"));
    }
}
