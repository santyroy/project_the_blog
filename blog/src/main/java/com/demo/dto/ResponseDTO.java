package com.demo.dto;

public record ResponseDTO(boolean result, String status, String message, Object data) {
}
