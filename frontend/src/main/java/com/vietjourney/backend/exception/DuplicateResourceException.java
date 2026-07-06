package com.vietjourney.backend.exception;

public class DuplicateResourceException extends BusinessException {
    public DuplicateResourceException(String message) {
        super(message, 409);
    }
}