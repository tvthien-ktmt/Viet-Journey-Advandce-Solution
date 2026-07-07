package com.vietjourney.backend.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Data
public class PassengerRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;
    @NotBlank(message = "Type is required")
    @jakarta.validation.constraints.Pattern(regexp = "^(adult|child|infant)$", message = "Invalid type")
    private String type; // adult, child, infant
    
    @NotBlank(message = "ID number is required")
    private String idNumber;
    
    @jakarta.validation.constraints.Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Invalid birth date format")
    private String birthDate;
    
    @jakarta.validation.constraints.Pattern(regexp = "^[MF]$", message = "Invalid gender")
    private String gender;
}
