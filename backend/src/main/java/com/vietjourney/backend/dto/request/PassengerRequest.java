package com.vietjourney.backend.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Data
public class PassengerRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;
    @NotBlank(message = "Type is required")
    private String type; // adult, child, infant
    
    private String idNumber;
    
    private String birthDate;
    
    private String gender;
}
