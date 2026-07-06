package com.vietjourney.backend.service;

import com.vietjourney.backend.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.vietjourney.backend.dto.response.NotificationDTO;

public interface NotificationService {
    Page<NotificationDTO> getUserNotifications(String userEmail, Pageable pageable);
    void markAsRead(Long notificationId, String userEmail);
    void createNotification(String userEmail, String title, String message);
}
