package com.demo.exception;

public class UserOTPExpiredException extends RuntimeException {
    public UserOTPExpiredException(String message) {
        super(message);
    }
}
