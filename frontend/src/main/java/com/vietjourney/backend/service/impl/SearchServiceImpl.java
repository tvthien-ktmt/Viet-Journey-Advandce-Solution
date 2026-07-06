package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.dto.response.SearchResponse;
import com.vietjourney.backend.repository.HotelRepository;
import com.vietjourney.backend.repository.TourRepository;
import com.vietjourney.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final TourRepository tourRepository;
    private final HotelRepository hotelRepository;

    @Override
    public SearchResponse searchAll(String query, String type, Pageable pageable) {
        SearchResponse response = new SearchResponse();

        if (type == null || type.isEmpty() || type.equals("all")) {
            response.setTours(tourRepository.searchTours(query, null, null, null, pageable).getContent());
            response.setHotels(hotelRepository.searchHotels(query, null, null, null, pageable).getContent());
        } else if (type.equals("tour")) {
            response.setTours(tourRepository.searchTours(query, null, null, null, pageable).getContent());
            response.setHotels(Collections.emptyList());
        } else if (type.equals("hotel")) {
            response.setTours(Collections.emptyList());
            response.setHotels(hotelRepository.searchHotels(query, null, null, null, pageable).getContent());
        }

        return response;
    }
}
