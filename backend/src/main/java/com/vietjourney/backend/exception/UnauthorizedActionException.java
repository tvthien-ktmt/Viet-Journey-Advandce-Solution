package com.vietjourney.backend.exception;

public class UnauthorizedActionException extends BusinessException {
    public UnauthorizedActionException(String message) {
        super(message, 401);
    }
}
