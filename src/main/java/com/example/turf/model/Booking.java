package com.example.turf.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    private String id;

    @DBRef
    private Turf turf;

    @DBRef
    private User user;

    // Flat fields for efficient querying (no @DBRef traversal needed)
    private String turfId;
    private String userId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String status; // CONFIRMED, CANCELLED, PENDING

    private String paymentStatus; // PENDING, PAID, FAILED

    private String stripeSessionId;
}
