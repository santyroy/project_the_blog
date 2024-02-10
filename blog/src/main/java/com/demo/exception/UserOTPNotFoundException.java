package com.demo.exception;

public class UserOTPNotFoundException extends RuntimeException {
    public UserOTPNotFoundException(String message) {
        super(message);
    }
}
