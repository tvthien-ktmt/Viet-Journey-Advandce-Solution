package com.vietjourney.backend.service;

import com.vietjourney.backend.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BlogService {
    Page<Blog> getBlogs(Pageable pageable);
    Blog getBlogBySlug(String slug);
}
