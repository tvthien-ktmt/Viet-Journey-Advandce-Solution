package com.vietjourney.backend.service;

import com.vietjourney.backend.dto.request.PaymentRequest;
import com.vietjourney.backend.dto.response.PaymentResponse;

public interface PaymentService {
    PaymentResponse createPayment(PaymentRequest request);
    PaymentResponse handleCallback(String transactionRef, String status);
}
