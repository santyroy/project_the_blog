package com.demo.controller;

import com.demo.dto.LoginRequestDTO;
import com.demo.dto.ResponseDTO;
import com.demo.dto.UserRequestDTO;
import com.demo.dto.UserResponseDTO;
import com.demo.entity.User;
import com.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static com.demo.util.Convertor.convertToUserResponseDTO;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ResponseDTO> signupUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        Integer userId = userService.signupUser(userRequestDTO);
        return new ResponseEntity<>(new ResponseDTO(
                true, "201", "Please check your mail and click on the confirmation link",
                Map.of("userId", userId)), HttpStatus.CREATED);
    }

    @GetMapping("/signupConfirm/{userId}/{otp}")
    public ResponseEntity<ResponseDTO> signupConfirmUser(@PathVariable int userId, @PathVariable int otp) {
        User user = userService.signupConfirm(userId, otp);
        UserResponseDTO userResponseDTO = convertToUserResponseDTO(user);
        return new ResponseEntity<>(
                new ResponseDTO(true, "201", "User Registered successfully", userResponseDTO),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/resendOTP/{userId}")
    public ResponseEntity<ResponseDTO> resentOTP(@PathVariable int userId) {
        userService.resendOTP(userId);
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "OTP sent successfully", null),
                HttpStatus.OK
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> loginUser(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        String token = userService.loginUser(loginRequestDTO);
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "User Logged in successfully", token),
                HttpStatus.OK
        );
    }

    @PostMapping("/forgetPassword")
    public ResponseEntity<ResponseDTO> forgetPassword(@RequestBody HashMap<String, String> map) {
        userService.generateOTPForNewPassword(map.get("email"));
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "OTP to Reset password has been sent to user's email", null),
                HttpStatus.OK
        );
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<ResponseDTO> resetPassword(@RequestBody HashMap<String, String> map) {
        String email = map.get("email");
        String otp = map.get("otp");
        String password = map.get("password");
        userService.resetPassword(email, Integer.parseInt(otp), password);
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "Password updated successfully", null),
                HttpStatus.OK
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> registerUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        User user = userService.registerUser(userRequestDTO);
        UserResponseDTO userResponseDTO = convertToUserResponseDTO(user);
        return new ResponseEntity<>(
                new ResponseDTO(true, "201", "User Registered successfully", userResponseDTO),
                HttpStatus.CREATED
        );
    }
}
