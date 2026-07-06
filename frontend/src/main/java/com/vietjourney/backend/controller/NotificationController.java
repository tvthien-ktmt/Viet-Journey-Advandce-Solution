package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.entity.Notification;
import com.vietjourney.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Notification>>> getNotifications(
            Authentication authentication, 
            Pageable pageable) {
        
        Page<Notification> notifications = notificationService.getUserNotifications(authentication.getName(), pageable);
        return ResponseEntity.ok(ApiResponse.success(notifications, "Danh sách thông báo"));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Đã đánh dấu đã đọc"));
    }
}
