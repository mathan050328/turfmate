package com.example.turf.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class AuthValidationService {

    private static final SecureRandom RANDOM = new SecureRandom();

    public boolean isValidGmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        String normalized = email.trim().toLowerCase();
        if (normalized.startsWith("@") || normalized.contains(" ")) {
            return false;
        }
        return normalized.endsWith("@gmail.com");
    }

    public String generateOtp() {
        int otp = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(otp);
    }
}
