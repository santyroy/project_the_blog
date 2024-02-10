package com.demo.exception;

public class UserOTPMismatchException extends RuntimeException {
    public UserOTPMismatchException(String message) {
        super(message);
    }
}
