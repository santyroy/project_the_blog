package com.demo.service;

import com.demo.dto.LoginRequestDTO;
import com.demo.dto.UserRequestDTO;
import com.demo.entity.ForgotPassword;
import com.demo.entity.User;
import com.demo.entity.UserImage;
import com.demo.entity.UserOTP;
import com.demo.exception.*;
import com.demo.repository.ForgetPasswordRepository;
import com.demo.repository.UserImageRepository;
import com.demo.repository.UserOTPRepository;
import com.demo.repository.UserRepository;
import com.demo.security.CustomUserDetails;
import com.demo.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class UserService {

    private final Logger LOG = LoggerFactory.getLogger(UserService.class);
    public static String UPLOAD_DIRECTORY = System.getProperty("user.dir") + "/uploads";

    private final UserRepository userRepository;
    private final UserImageRepository userImageRepository;
    private final UserOTPRepository userOTPRepository;
    private final ForgetPasswordRepository forgetPasswordRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;

    public UserService(UserRepository userRepository, UserImageRepository userImageRepository, UserOTPRepository userOTPRepository, ForgetPasswordRepository forgetPasswordRepository, PasswordEncoder passwordEncoder, AuthenticationManager authManager) {
        this.userRepository = userRepository;
        this.userImageRepository = userImageRepository;
        this.userOTPRepository = userOTPRepository;
        this.forgetPasswordRepository = forgetPasswordRepository;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authManager;
    }

    public User addUser(UserRequestDTO userRequestDTO) {
        String encryptPassword = passwordEncoder.encode(userRequestDTO.password());
        User user = new User(userRequestDTO.name(), userRequestDTO.email(), encryptPassword, "ROLE_USER", true);
        return userRepository.save(user);
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    public User updateUserById(Integer id, UserRequestDTO userRequestDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        user.setName(userRequestDTO.name());
        user.setEmail(userRequestDTO.email());

        // Validate role for new user
        if ("ROLE_USER".equals(userRequestDTO.role()) || "ROLE_ADMIN".equals(userRequestDTO.role())) {
            user.setRole(userRequestDTO.role());
        } else {
            user.setRole("ROLE_USER");
        }

        return userRepository.save(user);
    }

    public void deleteUserById(Integer id) {
        userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        userRepository.deleteById(id);
    }

    public User registerUser(UserRequestDTO userRequestDTO) {
        Optional<User> existingUser = userRepository.findByEmail(userRequestDTO.email());
        if (existingUser.isPresent()) {
            throw new UserAlreadyPresentException("User already present with email: " + userRequestDTO.email());
        }
        String encryptPassword = passwordEncoder.encode(userRequestDTO.password());
        User user = new User(userRequestDTO.name(), userRequestDTO.email(), encryptPassword, "ROLE_USER", true);
        return userRepository.save(user);
    }

    public String loginUser(LoginRequestDTO loginRequestDTO) {
        LOG.info("Login request for user: " + loginRequestDTO.email());
        // Authenticate user
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.email(), loginRequestDTO.password()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        List<String> roles = principal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

        // Generate JWT
        return JwtUtil.generateJWT(principal.getUserId(), principal.getUsername(), roles);
    }

    public Integer signupUser(UserRequestDTO userRequestDTO) {
        Optional<User> existingUser = userRepository.findByEmail(userRequestDTO.email());
        if (existingUser.isPresent()) {
            throw new UserAlreadyPresentException("User already present with email: " + userRequestDTO.email());
        }
        String encryptPassword = passwordEncoder.encode(userRequestDTO.password());
        User user = new User(userRequestDTO.name(), userRequestDTO.email(), encryptPassword, "ROLE_USER", false);
        user = userRepository.save(user);


        Random random = new Random();
        int otp = random.nextInt(1000, 9999);
        UserOTP userOTP = new UserOTP(user.getId(), otp, LocalDateTime.now().plusMinutes(5));
        userOTPRepository.save(userOTP);

        // TODO: Send email with OTP via mail server
        LOG.info("SignUp completion URL for user " + userRequestDTO.email()
                + " is: " + "http://localhost:8080/api/v1/auth/signupConfirm/" + user.getId() + "/" + otp);

        return user.getId();
    }

    public User signupConfirm(int userId, int otp) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found to complete registration");
        }

        Optional<UserOTP> userOTP = userOTPRepository.findByUserId(user.get().getId());
        if (userOTP.isEmpty()) {
            throw new UserOTPNotFoundException("No OTP found for user");
        }

        if (userOTP.get().getOtp() != otp) {
            throw new UserOTPMismatchException("OTP mismatch for user");
        }

        if (LocalDateTime.now().isAfter(userOTP.get().getExpiry())) {
            throw new UserOTPExpiredException("OTP expired for user");
        }

        user.get().setActive(true);
        userOTPRepository.delete(userOTP.get());
        return userRepository.save(user.get());
    }

    public void generateOTPForNewPassword(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found to update password");
        }

        Random random = new Random();
        int otp = random.nextInt(1000, 9999);

        ForgotPassword forgotPassword = new ForgotPassword(email, otp, LocalDateTime.now().plusMinutes(5));
        forgetPasswordRepository.save(forgotPassword);

        // TODO: send OTP to user's email
        LOG.info("OTP to reset password for user email: " + email + " is: " + otp + ". Validity 5 minutes.");
    }

    public void resetPassword(String email, int otp, String password) {
        Optional<ForgotPassword> optionalForgotPassword = forgetPasswordRepository.findByEmail(email);
        if (optionalForgotPassword.isEmpty()) {
            throw new UserNotFoundException("User did not request to reset password");
        }

        ForgotPassword forgotPassword = optionalForgotPassword.get();
        if (forgotPassword.getOtp() != otp) {
            throw new UserOTPMismatchException("Reset password OTP mismatched");
        }

        if (forgotPassword.getExpiry().isBefore(LocalDateTime.now())) {
            throw new UserOTPExpiredException("Reset password OTP expired");
        }

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found to reset password");
        }
        user.get().setPassword(passwordEncoder.encode(password));
        userRepository.save(user.get());
        forgetPasswordRepository.delete(forgotPassword);
    }

    public void resendOTP(int userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("User not found to complete registration");
        }

        User user = userOpt.get();
        Random random = new Random();
        int otp = random.nextInt(1000, 9999);
        Optional<UserOTP> optionalUserOTP = userOTPRepository.findByUserId(userId);

        if (optionalUserOTP.isEmpty()) {
            LOG.error("No OTP found for user {} ", user.getEmail());
        } else {
            UserOTP userOTP = optionalUserOTP.get();
            userOTP.setOtp(otp);
            userOTP.setExpiry(LocalDateTime.now().plusMinutes(5));
            userOTPRepository.save(userOTP);

            // TODO: Send email with OTP via mail server
            LOG.info("New OTP URL for user " + user.getEmail()
                    + " is: " + "http://localhost:8080/api/v1/auth/signupConfirm/" + user.getId() + "/" + otp);

        }
    }

    public String uploadUserImage(Integer userId, MultipartFile file) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("User not found to complete registration");
        }

        UUID uuid = UUID.randomUUID();
        StringBuilder fileName = new StringBuilder();

        if(!file.isEmpty() && file.getOriginalFilename() != null) {
            String fileExtension = file.getOriginalFilename().split("\\.")[1];
            fileName.append(uuid).append(".").append(fileExtension);
        }
        Path fileNameAndPath = Paths.get(UPLOAD_DIRECTORY, fileName.toString());

        try {
            Optional<UserImage> imageByUser = userImageRepository.findByUser(userOpt.get());
            if(imageByUser.isEmpty()) {
                userImageRepository.save(new UserImage(fileNameAndPath.toString(), userOpt.get()));
            } else {
                UserImage userImage = imageByUser.get();
                userImage.setPath(fileNameAndPath.toString());
                userImageRepository.save(userImage);
            }

            Files.write(fileNameAndPath, file.getBytes());
            return "Uploaded images: " + fileName;
        } catch (IOException e) {
            LOG.error("Path not found: " + UPLOAD_DIRECTORY);
            return "";
        }
    }
}
