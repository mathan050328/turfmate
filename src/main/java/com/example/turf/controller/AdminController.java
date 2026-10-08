package com.example.turf.controller;

import com.example.turf.model.Booking;
import com.example.turf.model.Turf;
import com.example.turf.repository.BookingRepository;
import com.example.turf.repository.TurfRepository;
import com.example.turf.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST Controller for Administrator Dashboard & Analytics.
 * 
 * Provides secured access to booking histories, status breakdown, and total revenue.
 * Protected via Role-Based Access Control (RBAC) and X-Admin-User-Id header validation.
 * 
 * Endpoint Base: /api/admin
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final BookingRepository bookingRepository;
    private final TurfRepository turfRepository;
    private final UserRepository userRepository;

    /**
     * Security Check: Verifies that the requesting user exists and possesses ROLE_ADMIN.
     */
    private void verifyAdmin(String adminUserId) {
        if (adminUserId == null || adminUserId.trim().isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Access denied: Missing admin credentials");
        }
        com.example.turf.model.User user = userRepository.findById(adminUserId).orElse(null);
        if (user == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Access denied: User not found");
        }
        boolean hasAdminRole = user.getRoles() != null && user.getRoles().stream()
                .anyMatch(r -> "ROLE_ADMIN".equalsIgnoreCase(r.getName()));
        if (!hasAdminRole) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Access denied: Administrator permissions required");
        }
    }

    /**
     * GET /api/admin/bookings - Fetch all system bookings, sorted by start time (newest first)
     */
    @GetMapping("/bookings")
    public List<Booking> getAllBookings(@RequestHeader(value = "X-Admin-User-Id", required = false) String adminUserId) {
        verifyAdmin(adminUserId);
        List<Booking> all = bookingRepository.findAll();
        all.sort(Comparator.comparing(
                b -> b.getStartTime() != null ? b.getStartTime() : java.time.LocalDateTime.MIN,
                Comparator.reverseOrder()));
        return all;
    }

    /**
     * GET /api/admin/stats - System Analytics Dashboard Metrics
     * Returns total bookings, confirmed/pending/cancelled breakdown, total revenue, turfs, and registered users.
     */
    @GetMapping("/stats")
    public Map<String, Object> getStats(@RequestHeader(value = "X-Admin-User-Id", required = false) String adminUserId) {
        verifyAdmin(adminUserId);
        List<Booking> all = bookingRepository.findAll();
        List<Turf> turfs = turfRepository.findAll();
        long users = userRepository.count();

        long confirmed = all.stream().filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus())).count();
        long pending   = all.stream().filter(b -> "PENDING".equalsIgnoreCase(b.getStatus())).count();
        long cancelled = all.stream().filter(b -> "CANCELLED".equalsIgnoreCase(b.getStatus())).count();

        // Revenue = sum of pricePerHour for PAID bookings
        double revenue = all.stream()
                .filter(b -> "PAID".equalsIgnoreCase(b.getPaymentStatus()))
                .mapToDouble(b -> {
                    if (b.getTurf() != null) return b.getTurf().getPricePerHour();
                    Turf t = turfRepository.findById(b.getTurfId()).orElse(null);
                    return t != null ? t.getPricePerHour() : 0.0;
                })
                .sum();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalBookings", all.size());
        stats.put("confirmedBookings", confirmed);
        stats.put("pendingBookings", pending);
        stats.put("cancelledBookings", cancelled);
        stats.put("totalRevenue", revenue);
        stats.put("totalTurfs", turfs.size());
        stats.put("totalUsers", users);
        return stats;
    }
}
