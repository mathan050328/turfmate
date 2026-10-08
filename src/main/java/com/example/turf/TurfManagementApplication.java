package com.example.turf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * <h1>Turf Management System</h1>
 * Main Spring Boot Application Entry Point.
 * 
 * <p>Key Architecture Highlights:</p>
 * <ul>
 *   <li><b>Authentication:</b> Email verification with 6-digit OTP via Spring Mail SMTP.</li>
 *   <li><b>Slot Booking Engine:</b> Dynamic slot computation, double-booking prevention, and date pickers.</li>
 *   <li><b>Payment Gateway:</b> Simulated UPI, QR Code, Card, and Pay-at-Turf transactions.</li>
 *   <li><b>Admin Management:</b> Role-based access control (RBAC), booking statistics, and revenue tracking.</li>
 * </ul>
 * 
 * @author TurfMate Engineering
 * @version 1.0.0
 */
@SpringBootApplication
public class TurfManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(TurfManagementApplication.class, args);
    }
}
