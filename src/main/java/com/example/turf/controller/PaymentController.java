package com.example.turf.controller;

import com.example.turf.model.Booking;
import com.example.turf.model.PaymentRequest;
import com.example.turf.model.Turf;
import com.example.turf.model.User;
import com.example.turf.repository.BookingRepository;
import com.example.turf.repository.TurfRepository;
import com.example.turf.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for Payment Processing and Checkout Session Management.
 * 
 * Supports both Stripe Checkout integration and simulated Mock Gateway (UPI / Pay at Venue).
 * 
 * Endpoint Base: /api/payment
 */
@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PaymentController {

    private final BookingRepository bookingRepository;
    private final TurfRepository turfRepository;
    private final UserRepository userRepository;
    private final com.example.turf.service.BookingService bookingService;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    /**
     * POST /api/payment/create-checkout-session - Stripe Checkout Session Initialization
     */
    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody PaymentRequest request) {
        try {
            Turf turf = turfRepository.findById(request.getTurfId())
                    .orElseThrow(() -> new RuntimeException("Turf not found"));

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            int hour = Integer.parseInt(request.getTime().split(":")[0]);
            LocalDate bookingDate = request.getDate() != null && !request.getDate().isBlank()
                    ? LocalDate.parse(request.getDate())
                    : LocalDate.now();
            LocalDateTime startTime = LocalDateTime.of(bookingDate, LocalTime.of(hour, 0));
            LocalDateTime endTime = startTime.plusHours(1);

            boolean alreadyBooked = bookingService.isSlotBooked(turf.getId(), startTime, endTime);
            if (alreadyBooked) {
                throw new RuntimeException("Slot is already booked");
            }

            Booking booking = new Booking();
            booking.setTurf(turf);
            booking.setTurfId(turf.getId());
            booking.setTurfName(turf.getName());
            booking.setUser(user);
            booking.setUserId(user.getId());
            booking.setStartTime(startTime);
            booking.setEndTime(endTime);
            booking.setStatus("PENDING");
            booking.setPaymentStatus("PENDING");
            bookingRepository.save(booking);

            String successUrl = "http://localhost:9123/index.html?payment=success&bookingId=" + booking.getId();
            String cancelUrl = "http://localhost:9123/index.html?payment=cancel";

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("inr")
                                    .setUnitAmount((long) (turf.getPricePerHour() * 100))
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Booking for " + turf.getName())
                                            .setDescription("Date: " + startTime.toLocalDate() + " Time: " + request.getTime())
                                            .build())
                                    .build())
                            .build())
                    .putMetadata("bookingId", booking.getId().toString())
                    .build();

            Session session = Session.create(params);

            booking.setStripeSessionId(session.getId());
            bookingRepository.save(booking);

            Map<String, String> response = new HashMap<>();
            response.put("sessionId", session.getId());
            response.put("sessionUrl", session.getUrl());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * POST /api/payment/mock-pay - Simulated Instant Payment Gateway (UPI / QR Code / Cash)
     * Validates slot availability, saves booking as CONFIRMED and PAID, and returns receipt metadata.
     */
    @PostMapping("/mock-pay")
    public ResponseEntity<Map<String, Object>> mockPay(@RequestBody PaymentRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Turf turf = turfRepository.findById(request.getTurfId())
                    .orElseThrow(() -> new RuntimeException("Turf not found"));

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            int hour = Integer.parseInt(request.getTime().split(":")[0]);
            LocalDate bookingDate = request.getDate() != null && !request.getDate().isBlank()
                    ? LocalDate.parse(request.getDate())
                    : LocalDate.now();
            LocalDateTime startTime = LocalDateTime.of(bookingDate, LocalTime.of(hour, 0));
            LocalDateTime endTime = startTime.plusHours(1);

            boolean alreadyBooked = bookingService.isSlotBooked(turf.getId(), startTime, endTime);
            if (alreadyBooked) {
                response.put("success", false);
                response.put("message", "This slot is already booked. Please choose another time.");
                return ResponseEntity.badRequest().body(response);
            }

            Booking booking = new Booking();
            booking.setTurf(turf);
            booking.setTurfId(turf.getId());
            booking.setTurfName(turf.getName());
            booking.setUser(user);
            booking.setUserId(user.getId());
            booking.setStartTime(startTime);
            booking.setEndTime(endTime);
            booking.setStatus("CONFIRMED");
            booking.setPaymentStatus("PAID");
            bookingRepository.save(booking);

            response.put("success", true);
            response.put("bookingId", booking.getId());
            response.put("message", "Payment successful! Booking confirmed.");
            response.put("turfName", turf.getName());
            response.put("amount", turf.getPricePerHour());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * GET /api/payment/success - Webhook / Success Callback Handler
     */
    @GetMapping("/success")
    public ResponseEntity<String> confirmBooking(@RequestParam String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("CONFIRMED");
        booking.setPaymentStatus("PAID");
        bookingRepository.save(booking);
        return ResponseEntity.ok("Booking Confirmed");
    }
}
