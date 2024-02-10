package com.demo.controller;

import com.demo.dto.ResponseDTO;
import com.demo.dto.UserRequestDTO;
import com.demo.dto.UserResponseDTO;
import com.demo.entity.User;
import com.demo.service.UserService;
import com.demo.util.Convertor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.demo.util.Convertor.convertToUserResponseDTO;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ResponseDTO> addNewUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        User user = userService.addUser(userRequestDTO);
        UserResponseDTO userResponseDTO = convertToUserResponseDTO(user);
        return new ResponseEntity<>(
                new ResponseDTO(true, "201", "User created successfully", userResponseDTO),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> getAllUsers() {
        List<User> users = userService.getUsers();
        Set<UserResponseDTO> userResponseDTOSet = users.stream().map(Convertor::convertToUserResponseDTO).collect(Collectors.toSet());
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "User retrieval successful", userResponseDTOSet),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        UserResponseDTO userResponseDTO = convertToUserResponseDTO(user);
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "User retrieval successful", userResponseDTO),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO> updateUserById(@PathVariable Integer id, @Valid @RequestBody UserRequestDTO userRequestDTO) {
        User user = userService.updateUserById(id, userRequestDTO);
        UserResponseDTO userResponseDTO = convertToUserResponseDTO(user);
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "User updated successfully", userResponseDTO),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO> deleteUserById(@PathVariable Integer id) {
        userService.deleteUserById(id);
        return new ResponseEntity<>(
                new ResponseDTO(true, "200", "User deleted successfully", null),
                HttpStatus.OK
        );
    }
}
