package com.vietjourney.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AdminUserDTO {
    private String id;
    private String email;
    private String fullName;
    private List<String> roles;
    private String lotusmilesTier;
}
