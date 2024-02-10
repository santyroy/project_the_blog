package com.demo.dto;

import java.util.Set;

public record UserResponseDTO(String userId, String name, String email, String role, Set<Integer> blogIds) {
}
