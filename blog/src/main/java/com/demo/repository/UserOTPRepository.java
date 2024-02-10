package com.demo.repository;

import com.demo.entity.UserOTP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserOTPRepository extends JpaRepository<UserOTP, Integer> {
    Optional<UserOTP> findByUserId(int userId);
}
