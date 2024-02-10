package com.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(@NotBlank(message = "Email cannot be blank") String email,
                              @NotBlank(message = "Password cannot be blank") String password) {
}
