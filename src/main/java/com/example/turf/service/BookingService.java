package com.example.turf.service;

import com.example.turf.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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

        if (selectedDate.isEqual(now.toLocalDate()) && slotStart.isBefore(now)) {
            return true;
        }

        return false;
    }
}
