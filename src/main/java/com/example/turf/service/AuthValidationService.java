package com.example.turf.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class AuthValidationService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private static final java.util.regex.Pattern EMAIL_PATTERN = java.util.regex.Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    public boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    @Deprecated
    public boolean isValidGmail(String email) {
        return isValidEmail(email);
    }

    public String generateOtp() {
        int otp = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(otp);
    }
}
