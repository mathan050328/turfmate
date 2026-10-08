package com.example.turf.service;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class BookingAndAuthServiceTest {

    private final AuthValidationService authValidationService = new AuthValidationService();
    private final BookingService bookingService = new BookingService(null);

    @Test
    void shouldAcceptValidGmailAddresses() {
        assertTrue(authValidationService.isValidGmail("user@gmail.com"));
        assertTrue(authValidationService.isValidGmail("demo123@gmail.com"));
    }

    @Test
    void shouldRejectInvalidGmailAddresses() {
        assertFalse(authValidationService.isValidGmail("@gmail.com"));
        assertFalse(authValidationService.isValidGmail("user@yahoo.com"));
        assertFalse(authValidationService.isValidGmail(""));
    }

    @Test
    void shouldGenerateSixDigitOtp() {
        String otp = authValidationService.generateOtp();
        assertEquals(6, otp.length());
        assertTrue(otp.chars().allMatch(Character::isDigit));
    }

    @Test
    void shouldDisablePastSlotsForTodayAndAllowFutureDates() {
        LocalDateTime now = LocalDateTime.of(2026, 7, 11, 8, 0);

        assertTrue(bookingService.shouldDisableSlot(LocalDate.of(2026, 7, 11), "07:00", now));
        assertFalse(bookingService.shouldDisableSlot(LocalDate.of(2026, 7, 11), "09:00", now));
        assertFalse(bookingService.shouldDisableSlot(LocalDate.of(2026, 7, 12), "06:00", now));
        assertTrue(bookingService.shouldDisableSlot(LocalDate.of(2026, 7, 10), "06:00", now));
    }
}
