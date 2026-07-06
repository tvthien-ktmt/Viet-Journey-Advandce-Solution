package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSummaryDTO {
    private Long id;
    private String fullName;
    private String email;
}
