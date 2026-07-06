package com.vietjourney.backend.controller;

import com.vietjourney.backend.dto.request.PaymentRequest;
import com.vietjourney.backend.dto.response.ApiResponse;
import com.vietjourney.backend.dto.response.PaymentResponse;
import com.vietjourney.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo URL thanh toán thành công"));
    }

    @GetMapping("/callback")
    public ResponseEntity<ApiResponse<PaymentResponse>> paymentCallback(@RequestParam java.util.Map<String, String> params) {
        PaymentResponse response = paymentService.handleCallback(params);
        return ResponseEntity.ok(ApiResponse.success(response, "Xử lý callback thanh toán thành công"));
    }
}
