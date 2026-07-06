package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.entity.Blog;
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
    public ResponseEntity<ApiResponse<Page<Blog>>> getBlogs(Pageable pageable) {
        Page<Blog> blogs = blogService.getBlogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(blogs, "Danh sách Blog"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<Blog>> getBlogBySlug(@PathVariable String slug) {
        Blog blog = blogService.getBlogBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(blog, "Chi tiết Blog"));
    }
}
