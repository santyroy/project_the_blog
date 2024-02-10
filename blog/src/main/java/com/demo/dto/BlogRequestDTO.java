package com.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record BlogRequestDTO(@NotBlank(message = "Blog Title cannot be blank") String title,
                             @NotBlank(message = "Blog Content cannot be blank") String content,
                             @NotBlank(message = "Blog User cannot be blank") String userId) {
}
