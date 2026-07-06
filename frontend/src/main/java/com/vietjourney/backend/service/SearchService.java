package com.vietjourney.backend.service;

import com.vietjourney.backend.dto.response.SearchResponse;
import org.springframework.data.domain.Pageable;

public interface SearchService {
    SearchResponse searchAll(String query, String type, Pageable pageable);
}
