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

    @Value("${app.payment.vnp-tmn-code}")
    private String vnpTmnCode;

    @Value("${app.payment.vnp-pay-url}")
    private String vnpPayUrl;

    @Value("${app.payment.vnp-return-url}")
    private String vnpReturnUrl;

    @Override
    public PaymentResponse generatePaymentUrl(PaymentContext ctx) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderInfo = ctx.getOrderInfo() != null ? ctx.getOrderInfo() : "Thanh toan don hang " + ctx.getTransactionRef();
        String orderType = "other";
        String vnp_TxnRef = ctx.getTransactionRef();
        String vnp_IpAddr = ctx.getIpAddr() != null ? ctx.getIpAddr() : "127.0.0.1";
        String vnp_TmnCode = this.vnpTmnCode;

        long amount = ctx.getAmount().longValue() * 100;
        java.util.Map<String, String> vnp_Params = new java.util.HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", this.vnpReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(java.time.LocalDateTime.now());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        java.util.List<String> fieldNames = new java.util.ArrayList<>(vnp_Params.keySet());
        java.util.Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        try {
            for (String fieldName : fieldNames) {
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName).append("=").append(java.net.URLEncoder.encode(fieldValue, "UTF-8")).append("&");
                    query.append(java.net.URLEncoder.encode(fieldName, "UTF-8")).append("=").append(java.net.URLEncoder.encode(fieldValue, "UTF-8")).append("&");
                }
            }
        } catch (Exception e) {
            throw new com.vietjourney.backend.exception.BusinessException("Lỗi encode VNPay parameters", 500);
        }
        if (hashData.length() > 0) hashData.setLength(hashData.length() - 1);
        if (query.length() > 0) query.setLength(query.length() - 1);

        String secureHash = calculateChecksum(hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);
        String paymentUrl = this.vnpPayUrl + "?" + query.toString();

        return PaymentResponse.builder()
                .paymentUrl(paymentUrl)
                .transactionRef(vnp_TxnRef)
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
