package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.entity.Blog;
import com.vietjourney.backend.repository.BlogRepository;
import com.vietjourney.backend.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;

    @Override
    public Page<Blog> getBlogs(Pageable pageable) {
        return blogRepository.findAllByOrderByPublishedAtDesc(pageable);
    }

    @Override
    public Blog getBlogBySlug(String slug) {
        return blogRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Blog not found with slug: " + slug));
    }
}
