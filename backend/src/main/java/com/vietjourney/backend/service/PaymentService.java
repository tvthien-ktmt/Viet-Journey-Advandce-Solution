package com.vietjourney.backend.service;

import com.vietjourney.backend.dto.request.PaymentRequest;
import com.vietjourney.backend.dto.response.PaymentResponse;

public interface PaymentService {
    PaymentResponse createPayment(PaymentRequest request, String userEmail);
    PaymentResponse handleCallback(java.util.Map<String, String> params);
}
