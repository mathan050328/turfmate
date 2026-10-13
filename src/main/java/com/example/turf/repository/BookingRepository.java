package com.example.turf.repository;

import com.example.turf.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByTurfIdAndStartTimeBetween(String turfId, LocalDateTime start, LocalDateTime end);
    List<Booking> findByTurfId(String turfId);
    List<Booking> findByUserId(String userId);
}
