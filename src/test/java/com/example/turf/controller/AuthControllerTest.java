package com.example.turf.controller;

import com.example.turf.model.User;
import com.example.turf.repository.UserRepository;
import com.example.turf.service.AuthValidationService;
import com.example.turf.service.EmailService;
import com.example.turf.service.OtpService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    @Test
    void shouldAllowRegistrationWhenOtpEmailDeliveryFails() {
        UserRepository userRepository = mock(UserRepository.class);
        EmailService emailService = mock(EmailService.class);
        AuthValidationService authValidationService = new AuthValidationService();
        OtpService otpService = new OtpService();

        when(userRepository.existsByEmail("user@gmail.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(emailService.sendVerificationEmail(anyString(), anyString())).thenReturn(false);

        AuthController controller = new AuthController(userRepository, emailService, authValidationService, otpService);

        AuthController.RegisterRequest request = new AuthController.RegisterRequest();
        request.setEmail("user@gmail.com");
        request.setUsername("demo");
        request.setPassword("123456");

        ResponseEntity<?> response = controller.register(request);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody() instanceof Map);

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertTrue((Boolean) body.get("success"));
        assertNotNull(body.get("otp"));
    }
}
