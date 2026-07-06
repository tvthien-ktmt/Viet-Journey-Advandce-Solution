package com.vietjourney.backend.dto.request;

import lombok.Data;

@Data
public class PassengerRequest {
    private String fullName;
    private String email;
    private String phone;
    private String documentNumber;
}
