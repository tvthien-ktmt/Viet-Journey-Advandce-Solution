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
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@Valid @RequestBody PaymentRequest request, java.security.Principal principal) {
        if (principal == null) throw new com.vietjourney.backend.exception.UnauthorizedActionException("Cần đăng nhập");
        PaymentResponse response = paymentService.createPayment(request, principal.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Tạo URL thanh toán thành công"));
    }

    @GetMapping("/callback")
    public ResponseEntity<ApiResponse<PaymentResponse>> paymentCallback(@RequestParam java.util.Map<String, String> params) {
        PaymentResponse response = paymentService.handleCallback(params);
        return ResponseEntity.ok(ApiResponse.success(response, "Xử lý callback thanh toán thành công"));
    }

    @GetMapping("/ipn")
    public ResponseEntity<String> paymentIpn(@RequestParam java.util.Map<String, String> params) {
        try {
            paymentService.handleCallback(params);
            return ResponseEntity.ok("{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}");
        } catch (com.vietjourney.backend.exception.BusinessException e) {
            if (e.getMessage().contains("Amount mismatch")) {
                return ResponseEntity.ok("{\"RspCode\":\"04\",\"Message\":\"Invalid amount\"}");
            } else if (e.getMessage().contains("Chữ ký")) {
                return ResponseEntity.ok("{\"RspCode\":\"97\",\"Message\":\"Invalid Checksum\"}");
            }
            return ResponseEntity.ok("{\"RspCode\":\"02\",\"Message\":\"Order already confirmed\"}");
        } catch (Exception e) {
            return ResponseEntity.ok("{\"RspCode\":\"99\",\"Message\":\"Unknown error\"}");
        }
    }
}
