package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminNewsDTO {
    private String id;
    private String title;
    private String category;
    private String status;
    private String date;
    private String slug;
}
