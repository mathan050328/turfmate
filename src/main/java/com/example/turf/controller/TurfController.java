package com.example.turf.controller;

import com.example.turf.model.Booking;
import com.example.turf.model.Turf;
import com.example.turf.model.User;
import com.example.turf.repository.BookingRepository;
import com.example.turf.repository.TurfRepository;
import com.example.turf.repository.UserRepository;
import com.example.turf.service.BookingService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/turfs")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class TurfController {

    private final TurfRepository turfRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final BookingService bookingService;

    @GetMapping
    public List<Turf> getAllTurfs() {
        return turfRepository.findAll();
    }

    @GetMapping("/{id}")
    public Turf getTurf(@PathVariable String id) {
        return turfRepository.findById(id).orElseThrow(() -> new RuntimeException("Turf not found with id: " + id));
    }

    @GetMapping("/{id}/slots")
    public List<SlotDTO> getSlots(@PathVariable String id, @RequestParam(required = false) String date) {
        LocalDate targetDate = (date != null && !date.isBlank()) ? LocalDate.parse(date) : LocalDate.now();
        List<SlotDTO> slots = new ArrayList<>();
        List<Booking> turfBookings = bookingRepository.findByTurfId(id);
        LocalDateTime now = LocalDateTime.now();

        for (int hour = 6; hour < 22; hour++) {
            LocalDateTime start = LocalDateTime.of(targetDate, LocalTime.of(hour, 0));
            LocalDateTime end = start.plusHours(1);

            boolean isBooked = bookingService.isSlotBookedInList(turfBookings, start, end);
            boolean isPast = bookingService.shouldDisableSlot(targetDate, hour + ":00", now);

            slots.add(new SlotDTO(hour + ":00", isBooked, isPast));
        }
        return slots;
    }

    @PostMapping("/book")
    public Booking bookTurf(@RequestBody BookingRequest request) {
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
            throw new RuntimeException("Slot is already booked for this time");
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

        return bookingRepository.save(booking);
    }

    @GetMapping("/bookings/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable String userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Data
    static class BookingRequest {
        private String turfId;
        private String userId;
        private String time;
        private String date;
    }

    @Data
    @AllArgsConstructor
    static class SlotDTO {
        private String time;
        private boolean booked;
        private boolean past;
    }
}
