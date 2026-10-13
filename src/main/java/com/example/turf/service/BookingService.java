package com.example.turf.service;

import com.example.turf.model.Booking;
import com.example.turf.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

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

    public boolean isSlotBooked(String turfId, LocalDateTime start, LocalDateTime end) {
        if (turfId == null) {
            return false;
        }
        return isSlotBookedInList(bookingRepository.findByTurfId(turfId), start, end);
    }

    public boolean isSlotBookedInList(List<Booking> bookings, LocalDateTime start, LocalDateTime end) {
        if (bookings == null || bookings.isEmpty()) {
            return false;
        }
        return bookings.stream().anyMatch(b -> {
            if ("CANCELLED".equalsIgnoreCase(b.getStatus())) {
                return false;
            }
            if (b.getStartTime() == null) {
                return false;
            }
            return !b.getStartTime().isBefore(start) && b.getStartTime().isBefore(end);
        });
    }
}
