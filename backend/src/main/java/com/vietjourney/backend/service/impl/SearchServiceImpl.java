package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.dto.response.SearchResponse;
import com.vietjourney.backend.service.HotelService;
import com.vietjourney.backend.service.SearchService;
import com.vietjourney.backend.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final TourService tourService;
    private final HotelService hotelService;

    @Override
    public SearchResponse searchAll(String query, String type, Pageable pageable) {
        SearchResponse response = new SearchResponse();

        if (type == null || type.isEmpty() || type.equals("all")) {
            response.setTours(tourService.searchTours(query, null, null, null, pageable).getContent().stream().map(com.vietjourney.backend.dto.response.TourDTO::fromEntity).collect(java.util.stream.Collectors.toList()));
            response.setHotels(hotelService.searchHotels(query, null, null, null, pageable).getContent());
        } else if (type.equals("tour")) {
            response.setTours(tourService.searchTours(query, null, null, null, pageable).getContent().stream().map(com.vietjourney.backend.dto.response.TourDTO::fromEntity).collect(java.util.stream.Collectors.toList()));
            response.setHotels(Collections.emptyList());
        } else if (type.equals("hotel")) {
            response.setTours(Collections.emptyList());
            response.setHotels(hotelService.searchHotels(query, null, null, null, pageable).getContent());
        }

        return response;
    }
}
