package com.example.turf.controller;

import com.example.turf.model.User;
import com.example.turf.repository.UserRepository;
import com.example.turf.service.AuthValidationService;
import com.example.turf.service.EmailService;
import com.example.turf.service.OtpService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final AuthValidationService authValidationService;
    private final OtpService otpService;

    /**
     * Register endpoint: Creates user and sends OTP email
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String normalizedEmail = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        
        // Validate email format
        if (!authValidationService.isValidEmail(normalizedEmail)) {
            return ResponseEntity.status(400).body(new ErrorResponse("Please enter a valid email address."));
        }
        
        // Validate password
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.status(400).body(new ErrorResponse("Password must be at least 6 characters long."));
        }
        
        // Validate username
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.status(400).body(new ErrorResponse("Username is required."));
        }
        
        // Check if email already registered
        if (userRepository.existsByEmail(normalizedEmail)) {
            User existingUser = userRepository.findByEmail(normalizedEmail).orElse(null);
            if (existingUser != null && !existingUser.isVerified()) {
                // Update existing user details if they register again with different info before verifying
                existingUser.setUsername(request.getUsername().trim());
                existingUser.setPassword(request.getPassword());
                userRepository.save(existingUser);
                
                // Generate and send new OTP
                String otp = otpService.generateOtp(normalizedEmail);
                boolean emailSent = emailService.sendVerificationEmail(normalizedEmail, otp);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("email", normalizedEmail);
                response.put("otpValidityMinutes", otpService.getOtpValidityInSeconds() / 60);
                response.put("otp", otp);
                
                if (!emailSent) {
                    response.put("message", "Registration updated! OTP generated locally because email delivery is unavailable. Use the code shown below to continue.");
                    response.put("emailDeliveryAvailable", false);
                    return ResponseEntity.ok(response);
                }
                
                response.put("message", "Registration updated! Please check your email for the verification OTP.");
                response.put("emailDeliveryAvailable", true);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(400).body(new ErrorResponse("Email already registered. Please login or use a different email."));
        }
        
        // Generate OTP
        String otp = otpService.generateOtp(normalizedEmail);
        
        // Create user (not verified yet)
        User user = new User();
        user.setEmail(normalizedEmail);
        user.setUsername(request.getUsername().trim());
        user.setPassword(request.getPassword()); // Note: In production, use bcrypt
        user.setVerified(false);
        user.setVerificationToken(null);
        userRepository.save(user);
        
        // Send verification email
        boolean emailSent = emailService.sendVerificationEmail(normalizedEmail, otp);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("email", normalizedEmail);
        response.put("otpValidityMinutes", otpService.getOtpValidityInSeconds() / 60);
        response.put("otp", otp);
        
        if (!emailSent) {
            response.put("message", "Registration successful! OTP generated locally because email delivery is unavailable. Use the code shown below to continue.");
            response.put("emailDeliveryAvailable", false);
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "Registration successful! Please check your email for the verification OTP.");
        response.put("emailDeliveryAvailable", true);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Send OTP endpoint: Send OTP to email (for new registrations or password reset)
     */
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) {
        String normalizedEmail = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        
        if (!authValidationService.isValidEmail(normalizedEmail)) {
            return ResponseEntity.status(400).body(new ErrorResponse("Please enter a valid email address."));
        }
        
        // Generate OTP
        String otp = otpService.generateOtp(normalizedEmail);
        
        // Send email
        boolean emailSent = emailService.sendVerificationEmail(normalizedEmail, otp);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("otp", otp);
        response.put("otpValidityMinutes", otpService.getOtpValidityInSeconds() / 60);
        
        if (!emailSent) {
            response.put("message", "OTP generated locally because email delivery is unavailable. Use the code shown below to continue.");
            response.put("emailDeliveryAvailable", false);
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "OTP sent to your email. Please check your inbox.");
        response.put("emailDeliveryAvailable", true);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Verify OTP endpoint: Verify the OTP entered by user
     */
    @PostMapping({"/verify-otp", "/verify"})
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        String normalizedEmail = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        
        if (normalizedEmail.isEmpty() || request.getOtp() == null || request.getOtp().isEmpty()) {
            return ResponseEntity.status(400).body(new ErrorResponse("Email and OTP are required."));
        }
        
        // Verify OTP using OtpService
        OtpService.VerifyOtpResponse otpResponse = otpService.verifyOtp(normalizedEmail, request.getOtp());
        
        if (!otpResponse.isSuccess()) {
            return ResponseEntity.status(400).body(new ErrorResponse(otpResponse.getMessage()));
        }
        
        // Find and update user
        return userRepository.findByEmail(normalizedEmail)
                .map(user -> {
                    if (user.isVerified()) {
                        return ResponseEntity.ok(new SuccessResponse("Email already verified. You can now login."));
                    }
                    
                    // Mark user as verified
                    user.setVerified(true);
                    user.setVerificationToken(null);
                    userRepository.save(user);
                    
                    // Send welcome email
                    emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Email verified successfully! You can now login.");
                    response.put("email", normalizedEmail);
                    
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(404).body(new ErrorResponse("Email not registered. Please sign up first.")));
    }

    /**
     * Resend OTP endpoint
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody SendOtpRequest request) {
        String normalizedEmail = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        
        if (!authValidationService.isValidEmail(normalizedEmail)) {
            return ResponseEntity.status(400).body(new ErrorResponse("Please enter a valid email address."));
        }
        
        // Check if user exists
        if (!userRepository.existsByEmail(normalizedEmail)) {
            return ResponseEntity.status(404).body(new ErrorResponse("Email not registered."));
        }
        
        // Check if already verified
        User user = userRepository.findByEmail(normalizedEmail).get();
        if (user.isVerified()) {
            return ResponseEntity.status(400).body(new ErrorResponse("Email already verified. Please login."));
        }
        
        // Generate and send new OTP
        String otp = otpService.generateOtp(normalizedEmail);
        boolean emailSent = emailService.sendVerificationEmail(normalizedEmail, otp);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("otp", otp);
        response.put("otpValidityMinutes", otpService.getOtpValidityInSeconds() / 60);
        
        if (!emailSent) {
            response.put("message", "New OTP generated locally because email delivery is unavailable. Use the code shown below to continue.");
            response.put("emailDeliveryAvailable", false);
            return ResponseEntity.ok(response);
        }
        
        response.put("message", "New OTP sent to your email.");
        response.put("emailDeliveryAvailable", true);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Login endpoint: Only allows login if email is verified
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String normalizedEmail = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        
        if (!authValidationService.isValidEmail(normalizedEmail)) {
            return ResponseEntity.status(400).body(new ErrorResponse("Please enter a valid email address."));
        }
        
        return userRepository.findByEmail(normalizedEmail)
                .map(user -> {
                    if (!user.isVerified()) {
                        return ResponseEntity.status(403).body(new ErrorResponse("Email not verified. Please verify your email to login."));
                    }
                    if (user.getPassword().equals(request.getPassword())) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("message", "Login successful!");
                        response.put("user", new AuthResponse(user.getId(), user.getEmail(), user.getUsername()));
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.status(401).body(new ErrorResponse("Invalid password."));
                    }
                })
                .orElse(ResponseEntity.status(404).body(new ErrorResponse("Email not registered. Please sign up.")));
    }

    /**
     * Check verification status
     */
    @PostMapping("/check-verification")
    public ResponseEntity<?> checkVerification(@RequestBody EmailCheckRequest request) {
        String normalizedEmail = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        
        if (normalizedEmail.isEmpty()) {
            return ResponseEntity.status(400).body(new ErrorResponse("Email is required."));
        }
        
        return userRepository.findByEmail(normalizedEmail)
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("verified", user.isVerified());
                    response.put("email", normalizedEmail);
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.status(404).body((Object) new ErrorResponse("Email not registered.")));
    }

    // ==================== Request/Response Classes ====================

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
    static class SendOtpRequest {
        private String email;
    }
    
    @Data
    static class VerifyOtpRequest {
        private String email;
        private String otp;
    }
    
    @Data
    static class EmailCheckRequest {
        private String email;
    }

    @Data
    @AllArgsConstructor
    static class AuthResponse {
        private String id;
        private String email;
        private String username;
    }
    
    @Data
    @AllArgsConstructor
    static class ErrorResponse {
        private String error;
        private boolean success;
        
        public ErrorResponse(String error) {
            this.error = error;
            this.success = false;
        }
    }
    
    @Data
    @AllArgsConstructor
    static class SuccessResponse {
        private String message;
        private boolean success;
        
        public SuccessResponse(String message) {
            this.message = message;
            this.success = true;
        }
    }
}
