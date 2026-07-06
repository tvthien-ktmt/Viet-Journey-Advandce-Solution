package com.vietjourney.backend.integration.controller;

import com.vietjourney.backend.controller.TourController;
import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.PageResponse;
import com.vietjourney.backend.entity.Tour;
import com.vietjourney.backend.security.JwtAuthenticationFilter;
import com.vietjourney.backend.security.JwtService;
import com.vietjourney.backend.service.TourService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

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
    private JwtService jwtService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void getAllTours_ReturnsPageResponse() throws Exception {
        Tour tour = Tour.builder().id(1L).title("Test Tour").price(100.0).build();
        PageResponse<Tour> pageResponse = PageResponse.<Tour>builder()
                .content(List.of(tour))
                .pageNumber(0)
                .pageSize(10)
                .totalElements(1)
                .totalPages(1)
                .isLast(true)
                .build();

        when(tourService.getAllTours(any())).thenReturn(pageResponse);

        mockMvc.perform(get("/api/tours")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].title").value("Test Tour"))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    void getTourById_ValidId_ReturnsTour() throws Exception {
        Tour tour = Tour.builder().id(1L).title("Test Tour").price(100.0).build();

        when(tourService.getTourById(anyLong())).thenReturn(tour);

        mockMvc.perform(get("/api/tours/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Test Tour"));
    }
}