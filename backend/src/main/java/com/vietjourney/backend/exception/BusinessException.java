package com.vietjourney.backend.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final int statusCode;

    public BusinessException(String message) {
        super(message);
        this.statusCode = 400; // default Bad Request
    }

    public BusinessException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
