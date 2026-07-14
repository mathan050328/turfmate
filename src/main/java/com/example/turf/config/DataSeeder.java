package com.example.turf.config;

import com.example.turf.model.Role;
import com.example.turf.model.Turf;
import com.example.turf.model.User;
import com.example.turf.repository.RoleRepository;
import com.example.turf.repository.TurfRepository;
import com.example.turf.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

        private final RoleRepository roleRepository;
        private final TurfRepository turfRepository;
        private final UserRepository userRepository;

        public DataSeeder(RoleRepository roleRepository, TurfRepository turfRepository, UserRepository userRepository) {
                this.roleRepository = roleRepository;
                this.turfRepository = turfRepository;
                this.userRepository = userRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                if (roleRepository.count() == 0) {
                        roleRepository.save(new Role(null, "ROLE_USER"));
                        roleRepository.save(new Role(null, "ROLE_ADMIN"));
                }

                if (userRepository.count() == 0) {
                        User user = new User();
                        user.setEmail("user@example.com");
                        user.setUsername("DefaultUser");
                        user.setPassword("password"); // Plain text for simplicity in this demo
                        userRepository.save(user);
                }

                if (turfRepository.count() == 0) {
                        turfRepository.saveAll(List.of(
                                        new Turf(null, "Green Valley Football", "Downtown", "Football", 1200.0,
                                                        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"),
                                        new Turf(null, "Super Strikers Arena", "Westside", "Cricket", 800.0,
                                                        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800"),
                                        new Turf(null, "Prime Badminton Club", "City Center", "Badminton", 600.0,
                                                        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800"),
                                        new Turf(null, "Shuttle Master Arena", "North Side", "Badminton", 550.0,
                                                        "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&q=80&w=800"),
                                        new Turf(null, "Ace Tennis Academy", "Uptown", "Tennis", 1000.0,
                                                        "https://images.unsplash.com/photo-1595435066319-70528421928f?auto=format&fit=crop&q=80&w=800"),
                                        new Turf(null, "Hoop Dreams Court", "East End", "Basketball", 700.0,
                                                        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800"),
                                        new Turf(null, "Pickleball Pro Hub", "South Side", "Pickleball", 600.0,
                                                        "https://images.unsplash.com/photo-1629731634341-2a62174360e2?auto=format&fit=crop&q=80&w=800"),
                                        new Turf(null, "Spike Volleyball Zone", "Westside", "Volleyball", 550.0,
                                                        "https://images.unsplash.com/photo-1592656670491-ee81115eeaa7?auto=format&fit=crop&q=80&w=800")));
                }
        }
}
