package com.demo.repository;

import com.demo.entity.ForgotPassword;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForgetPasswordRepository extends JpaRepository<ForgotPassword, Integer> {

    Optional<ForgotPassword> findByEmail(String email);
}
