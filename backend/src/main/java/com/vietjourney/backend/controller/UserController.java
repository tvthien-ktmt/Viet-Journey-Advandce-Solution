package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.request.UpdateProfileRequest;
import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.UserDTO;
import com.vietjourney.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        
        if (authentication == null) {
            throw new com.vietjourney.backend.exception.UnauthorizedActionException("Unauthorized");
        }

        UserDTO updatedUser = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "Cập nhật hồ sơ thành công"));
    }
}
