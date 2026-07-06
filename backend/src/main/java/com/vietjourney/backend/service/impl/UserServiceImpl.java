package com.vietjourney.backend.service.impl;

import com.vietjourney.backend.dto.request.UpdateProfileRequest;
import com.vietjourney.backend.dto.response.UserDTO;
import com.vietjourney.backend.entity.User;
import com.vietjourney.backend.repository.UserRepository;
import com.vietjourney.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDTO updateProfile(String userEmail, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new com.vietjourney.backend.exception.ResourceNotFoundException("Người dùng không tồn tại"));

        user.setFullName(com.vietjourney.backend.utils.HtmlSanitizer.sanitize(request.getFullName()));
        user.setPhone(com.vietjourney.backend.utils.HtmlSanitizer.sanitize(request.getPhone()));

        User updatedUser = userRepository.save(user);

        return UserDTO.builder()
                .id(updatedUser.getId())
                .fullName(updatedUser.getFullName())
                .email(updatedUser.getEmail())
                .phone(updatedUser.getPhone())
                .role(updatedUser.getRole() == null ? "USER" : updatedUser.getRole())
                .lotusmilesTier(updatedUser.getLotusmilesTier())
                .lotusmilesMiles(updatedUser.getLotusmilesMiles())
                .createdAt(updatedUser.getCreatedAt())
                .build();
    }
}
