package com.example.turf.service;

import com.example.turf.model.Booking;
import com.example.turf.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Service layer for slot availability logic and date calculations.
 */
@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /**
     * Determines whether a slot should be disabled (e.g. past time today, or past date).
     * 
     * @param selectedDate Target date chosen by user
     * @param timeLabel Slot start time (e.g. "14:00")
     * @param now Current timestamp
     * @return true if the slot has already passed
     */
    public boolean shouldDisableSlot(LocalDate selectedDate, String timeLabel, LocalDateTime now) {
        if (selectedDate == null || timeLabel == null || timeLabel.isBlank()) {
            return true;
        }

        if (selectedDate.isBefore(now.toLocalDate())) {
            return true;
        }

        int hour = Integer.parseInt(timeLabel.split(":")[0]);
        LocalDateTime slotStart = LocalDateTime.of(selectedDate, LocalTime.of(hour, 0));

        return selectedDate.isEqual(now.toLocalDate()) && slotStart.isBefore(now);
    }

    /**
     * Checks if a slot is already booked for a specific turf and time range.
     * Matches both turfId flat field and DBRef turf object for 100% data compatibility.
     */
    public boolean isSlotBooked(String turfId, LocalDateTime start, LocalDateTime end) {
        if (turfId == null) return false;
        return bookingRepository.findAll().stream().anyMatch(b -> {
            if ("CANCELLED".equalsIgnoreCase(b.getStatus())) return false;
            String bTurfId = b.getTurfId() != null ? b.getTurfId() : (b.getTurf() != null ? b.getTurf().getId() : null);
            if (bTurfId == null || !bTurfId.equalsIgnoreCase(turfId)) return false;
            if (b.getStartTime() == null) return false;
            return !b.getStartTime().isBefore(start) && b.getStartTime().isBefore(end);
        });
    }
}
