package com.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record UserRequestDTO(@NotBlank(message = "User's name cannot be blank") String name,
                             @NotBlank(message = "User's email cannot be blank") String email,
                             String password,
                             String role) {
}
