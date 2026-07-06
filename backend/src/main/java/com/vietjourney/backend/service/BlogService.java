package com.vietjourney.backend.service;

import com.vietjourney.backend.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.vietjourney.backend.dto.response.BlogDTO;

public interface BlogService {
    Page<BlogDTO> getBlogs(Pageable pageable);
    BlogDTO getBlogBySlug(String slug);
}
