package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.SearchResponse;
import com.vietjourney.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<ApiResponse<SearchResponse>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "all") String type,
            Pageable pageable) {

        SearchResponse results = searchService.searchAll(q, type, pageable);
        return ResponseEntity.ok(ApiResponse.success(results, "Tìm kiếm thành công"));
    }
}
