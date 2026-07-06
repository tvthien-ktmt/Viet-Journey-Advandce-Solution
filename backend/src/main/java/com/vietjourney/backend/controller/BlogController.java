package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.BlogDTO;
import com.vietjourney.backend.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BlogDTO>>> getBlogs(Pageable pageable) {
        Page<BlogDTO> blogs = blogService.getBlogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(blogs, "Danh sách Blog"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<BlogDTO>> getBlogBySlug(@PathVariable String slug) {
        BlogDTO blog = blogService.getBlogBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(blog, "Chi tiết Blog"));
    }
}
