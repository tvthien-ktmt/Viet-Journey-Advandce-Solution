package com.vietjourney.backend.dto.response;

import com.vietjourney.backend.entity.Hotel;
import com.vietjourney.backend.entity.Tour;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponse {
    private List<com.vietjourney.backend.dto.response.TourDTO> tours;
    private List<com.vietjourney.backend.dto.response.HotelDTO> hotels;
}
