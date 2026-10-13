package com.example.turf.controller;

import com.example.turf.model.Role;
import com.example.turf.model.User;
import com.example.turf.repository.RoleRepository;
import com.example.turf.repository.UserRepository;
import com.example.turf.service.AuthValidationService;
import com.example.turf.service.EmailService;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final AuthValidationService authValidationService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String normalizedEmail = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        if (!authValidationService.isValidGmail(normalizedEmail)) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", "Please enter a valid Gmail address."));
        }
        
        return userRepository.findByEmail(normalizedEmail)
                .map(user -> {
                    if (!user.isVerified()) {
                        return ResponseEntity.status(403).body((Object) Map.of("success", false, "error", "Please verify your email before logging in."));
                    }
                    boolean isBcryptMatch = passwordEncoder.matches(request.getPassword(), user.getPassword());
                    boolean isLegacyPlainMatch = user.getPassword().equals(request.getPassword());

                    if (isBcryptMatch || isLegacyPlainMatch) {
                        // Migrate legacy plain-text password to hash on login
                        if (isLegacyPlainMatch && !isBcryptMatch) {
                            user.setPassword(passwordEncoder.encode(request.getPassword()));
                            userRepository.save(user);
                        }

                        boolean isAdmin = user.getRoles() != null && user.getRoles().stream()
                                .anyMatch(r -> "ROLE_ADMIN".equalsIgnoreCase(r.getName()));
                        return ResponseEntity.ok((Object) new AuthResponse(user.getId(), user.getEmail(), user.getUsername(), isAdmin));
                    } else {
                        return ResponseEntity.status(401).body((Object) Map.of("success", false, "error", "Invalid email or password"));
                    }
                })
                .orElse(ResponseEntity.status(404).body(Map.of("success", false, "error", "Email not registered. Would you like to create an account?")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String normalizedEmail = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        if (!authValidationService.isValidGmail(normalizedEmail)) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", "Please enter a valid Gmail address."));
        }
        
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", "Password must be at least 6 characters long for security."));
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", "Email already in use"));
        }
        
        String otp = authValidationService.generateOtp();
        
        User user = new User();
        user.setEmail(normalizedEmail);
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerified(false);
        user.setVerificationToken(otp);

        Role userRole = roleRepository.findByName("ROLE_USER").orElse(null);
        if (userRole != null) {
            user.setRoles(Set.of(userRole));
        }

        userRepository.save(user);
        
        boolean emailSent = false;
        try {
            emailSent = emailService.sendVerificationEmail(user.getEmail(), otp);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", emailSent ? "User registered successfully. Please check your email for the verification OTP." : "User registered! Verification code: " + otp);
        resp.put("otp", otp);
        return ResponseEntity.ok(resp);
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyRequest request) {
        String normalizedEmail = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        return userRepository.findByEmail(normalizedEmail)
                .map(user -> {
                    if (user.isVerified()) {
                        return ResponseEntity.ok(Map.of("success", true, "message", "Email already verified."));
                    }
                    if (user.getVerificationToken() != null && user.getVerificationToken().equals(request.getOtp())) {
                        user.setVerified(true);
                        user.setVerificationToken(null);
                        userRepository.save(user);
                        return ResponseEntity.ok(Map.of("success", true, "message", "Email verified successfully. You can now login."));
                    } else {
                        return ResponseEntity.status(400).body(Map.of("success", false, "error", "Invalid verification code."));
                    }
                }).orElse(ResponseEntity.status(404).body(Map.of("success", false, "error", "Email not registered.")));
    }

    @Data
    static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    static class RegisterRequest {
        private String email;
        private String username;
        private String password;
    }
    
    @Data
    static class VerifyRequest {
        private String email;
        private String otp;
    }

    @Data
    @AllArgsConstructor
    static class AuthResponse {
        private String id;
        private String email;
        private String username;
        @JsonProperty("isAdmin")
        private boolean isAdmin;
    }
}
