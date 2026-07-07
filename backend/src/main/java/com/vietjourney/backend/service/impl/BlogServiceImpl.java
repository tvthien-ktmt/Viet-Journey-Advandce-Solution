package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.entity.Blog;
import com.vietjourney.backend.repository.BlogRepository;
import com.vietjourney.backend.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.vietjourney.backend.dto.response.BlogDTO;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;

    @Override
    public Page<BlogDTO> getBlogs(Pageable pageable) {
        return blogRepository.findAllByOrderByPublishedAtDesc(pageable)
                .map(this::mapToDTO);
    }

    @Override
    public BlogDTO getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Blog not found with slug: " + slug));
        return mapToDTO(blog);
    }
    
    private BlogDTO mapToDTO(Blog blog) {
        return BlogDTO.builder()
                .id(blog.getId())
                .title(com.vietjourney.backend.utils.HtmlSanitizer.sanitize(blog.getTitle()))
                .slug(blog.getSlug())
                .thumbnail(blog.getThumbnail())
                .excerpt(com.vietjourney.backend.utils.HtmlSanitizer.sanitize(blog.getExcerpt()))
                .content(com.vietjourney.backend.utils.HtmlSanitizer.sanitizeRich(blog.getContent()))
                .author(blog.getAuthor())
                .publishedAt(blog.getPublishedAt())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .build();
    }
}
