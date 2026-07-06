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
            javax.crypto.Mac hmacSHA512 = javax.crypto.Mac.getInstance("HmacSHA512");
            javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(vnpHashSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA512");
            hmacSHA512.init(secretKey);
            byte[] hashBytes = hmacSHA512.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
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
    public boolean verifyCallback(java.util.Map<String, String> params) {
        String secureHash = params.get("vnp_SecureHash");
        if (secureHash == null) return false;
        
        java.util.List<String> fieldNames = new java.util.ArrayList<>(params.keySet());
        java.util.Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        try {
            for (String fieldName : fieldNames) {
                String fieldValue = params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0) && !fieldName.equals("vnp_SecureHash") && !fieldName.equals("vnp_SecureHashType")) {
                    hashData.append(fieldName).append("=").append(java.net.URLEncoder.encode(fieldValue, "UTF-8")).append("&");
                }
            }
            if (hashData.length() > 0) {
                hashData.setLength(hashData.length() - 1);
            }
        } catch (Exception e) {
            return false;
        }
        String expectedHash = calculateChecksum(hashData.toString());
        return expectedHash.equalsIgnoreCase(secureHash);
    }
    
    @Override
    public boolean isSuccessStatus(String status) {
        return "00".equals(status);
    }
}
