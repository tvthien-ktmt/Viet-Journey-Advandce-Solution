package com.vietjourney.backend.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PageableUtil {
    public static Pageable createPageable(int page, int size, String sort) {
        if (size > 100) size = 100;
        if (size < 1) size = 10;
        String[] sortParts = sort.split(",");
        String property = sortParts[0];
        if (!property.matches("^[a-zA-Z0-9_]+$")) {
            property = "id";
        }
        Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc")
            ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(direction, property));
    }
}
