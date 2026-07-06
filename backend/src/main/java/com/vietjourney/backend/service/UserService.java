package com.vietjourney.backend.service;

import com.vietjourney.backend.dto.request.UpdateProfileRequest;
import com.vietjourney.backend.dto.response.UserDTO;

public interface UserService {
    UserDTO updateProfile(String userEmail, UpdateProfileRequest request);
}
