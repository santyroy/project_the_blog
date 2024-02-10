package com.demo.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record BlogResponseDTO(Integer id, String title, String content, LocalDateTime createdDate,
                              LocalDateTime modifiedDate, String userId) {
}
