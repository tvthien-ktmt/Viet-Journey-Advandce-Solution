package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BlogDTO {
    private Long id;
    private String title;
    private String slug;
    private String thumbnail;
    private String excerpt;
    private String content;
    private String author;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
