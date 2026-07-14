package com.example.turf.service;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long OTP_VALIDITY_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
    private static final int MAX_ATTEMPTS = 5;
    
    // Store OTP details: email -> {otp, timestamp, attempts}
    private final Map<String, OtpDetails> otpStorage = new ConcurrentHashMap<>();

    public static class OtpDetails {
        public String otp;
        public long createdAt;
        public int failedAttempts;

        public OtpDetails(String otp) {
            this.otp = otp;
            this.createdAt = System.currentTimeMillis();
            this.failedAttempts = 0;
        }

        public boolean isExpired() {
            return (System.currentTimeMillis() - createdAt) > OTP_VALIDITY_DURATION;
        }

        public boolean isBlocked() {
            return failedAttempts >= MAX_ATTEMPTS;
        }
    }

    /**
     * Generate and store a new OTP for the given email
     */
    public String generateOtp(String email) {
        String otp = String.format("%06d", RANDOM.nextInt(1000000));
        otpStorage.put(email.toLowerCase(), new OtpDetails(otp));
        return otp;
    }

    /**
     * Verify the OTP for the given email
     */
    public VerifyOtpResponse verifyOtp(String email, String providedOtp) {
        email = email.toLowerCase();
        
        if (!otpStorage.containsKey(email)) {
            return new VerifyOtpResponse(false, "OTP not found. Please register or request a new OTP.");
        }

        OtpDetails otpDetails = otpStorage.get(email);

        if (otpDetails.isBlocked()) {
            return new VerifyOtpResponse(false, "Too many failed attempts. Please request a new OTP.");
        }

        if (otpDetails.isExpired()) {
            otpStorage.remove(email);
            return new VerifyOtpResponse(false, "OTP has expired. Please request a new OTP.");
        }

        if (!otpDetails.otp.equals(providedOtp)) {
            otpDetails.failedAttempts++;
            if (otpDetails.isBlocked()) {
                otpStorage.remove(email);
                return new VerifyOtpResponse(false, "Too many failed attempts. Please request a new OTP.");
            }
            int remaining = MAX_ATTEMPTS - otpDetails.failedAttempts;
            return new VerifyOtpResponse(false, "Invalid OTP. " + remaining + " attempts remaining.");
        }

        // OTP is valid
        otpStorage.remove(email);
        return new VerifyOtpResponse(true, "OTP verified successfully.");
    }

    /**
     * Check if OTP is still valid for the given email
     */
    public boolean isOtpValid(String email) {
        email = email.toLowerCase();
        if (!otpStorage.containsKey(email)) {
            return false;
        }
        OtpDetails otpDetails = otpStorage.get(email);
        return !otpDetails.isExpired() && !otpDetails.isBlocked();
    }

    /**
     * Clear OTP for the given email
     */
    public void clearOtp(String email) {
        otpStorage.remove(email.toLowerCase());
    }

    /**
     * Get OTP validity time in seconds
     */
    public long getOtpValidityInSeconds() {
        return OTP_VALIDITY_DURATION / 1000;
    }

    public static class VerifyOtpResponse {
        public boolean success;
        public String message;

        public VerifyOtpResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }
    }
}
