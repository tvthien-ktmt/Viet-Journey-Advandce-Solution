package com.vietjourney.backend.service.strategy.payment;

import com.vietjourney.backend.dto.response.PaymentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("vnpayPaymentStrategy")
@RequiredArgsConstructor
public class VNPayStrategyImpl implements PaymentGatewayStrategy {

    @Value("${app.payment.vnp-hash-secret}")
    private String vnpHashSecret;

    private String calculateChecksum(String data) {
        try {
            javax.crypto.Mac hmacSHA256 = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(vnpHashSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256");
            hmacSHA256.init(secretKey);
            byte[] hashBytes = hmacSHA256.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new com.vietjourney.backend.exception.BusinessException("Failed to calculate VNPay checksum: " + e.getMessage(), 500);
        }
    }

    @Override
    public PaymentResponse generatePaymentUrl(String transactionRef) {
        String hashPayload = "vnp_TxnRef=" + transactionRef;
        String secureHash = calculateChecksum(hashPayload);
        String paymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TxnRef=" + transactionRef + "&vnp_SecureHash=" + secureHash;

        return PaymentResponse.builder()
                .paymentUrl(paymentUrl)
                .transactionRef(transactionRef)
                .status("pending")
                .build();
    }

    @Override
    public boolean verifyCallback(String transactionRef, String status, String secureHash) {
        String hashPayload = "vnp_TxnRef=" + transactionRef + "&vnp_ResponseCode=" + status;
        String expectedHash = calculateChecksum(hashPayload);
        return expectedHash.equalsIgnoreCase(secureHash);
    }
}
