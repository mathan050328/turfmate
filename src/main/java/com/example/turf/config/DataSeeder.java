package com.example.turf.config;

import com.example.turf.model.Role;
import com.example.turf.model.Turf;
import com.example.turf.model.User;
import com.example.turf.repository.RoleRepository;
import com.example.turf.repository.TurfRepository;
import com.example.turf.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

        private final RoleRepository roleRepository;
        private final TurfRepository turfRepository;
        private final UserRepository userRepository;
        private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

        @Value("${admin.email:mathanadmin@gmail.com}")
        private String adminEmail;

        @Value("${admin.username:MathanAdmin}")
        private String adminUsername;

        @Value("${admin.password:admin1234}")
        private String adminPassword;

        public DataSeeder(RoleRepository roleRepository, TurfRepository turfRepository, UserRepository userRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
                this.roleRepository = roleRepository;
                this.turfRepository = turfRepository;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        public void run(String... args) throws Exception {
                Role userRole = roleRepository.findByName("ROLE_USER").orElse(null);
                Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElse(null);

                if (userRole == null) {
                        userRole = roleRepository.save(new Role(null, "ROLE_USER"));
                }
                if (adminRole == null) {
                        adminRole = roleRepository.save(new Role(null, "ROLE_ADMIN"));
                }

                // Seed or sync admin account with hashed password
                User admin = userRepository.findByEmail(adminEmail).orElseGet(() -> {
                        User u = new User();
                        u.setEmail(adminEmail);
                        return u;
                });
                admin.setEmail(adminEmail);
                admin.setUsername(adminUsername);
                if (admin.getPassword() == null || !admin.getPassword().startsWith("$2a$")) {
                        admin.setPassword(passwordEncoder.encode(adminPassword));
                }
                admin.setVerified(true);
                admin.setRoles(java.util.Set.of(adminRole));
                userRepository.save(admin);

                if (!userRepository.existsByEmail("user@example.com")) {
                        User user = new User();
                        user.setEmail("user@example.com");
                        user.setUsername("DefaultUser");
                        user.setPassword(passwordEncoder.encode("password"));
                        user.setVerified(true);
                        user.setRoles(java.util.Set.of(userRole));
                        userRepository.save(user);
                }

                // Automatic DB Migration: Ensure EVERY user password in MongoDB is BCrypt hashed
                userRepository.findAll().forEach(u -> {
                        if (u.getPassword() != null && !u.getPassword().startsWith("$2a$")) {
                                u.setPassword(passwordEncoder.encode(u.getPassword()));
                                userRepository.save(u);
                        }
                });

                // Standardized Sport Images
                String footballImg = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800";
                String cricketImg  = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800";
                String badmintonImg = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800";
                String tennisImg   = "https://images.unsplash.com/photo-1595435066319-70528421928f?auto=format&fit=crop&q=80&w=800";
                String basketballImg = "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800";
                String volleyballImg = "https://images.unsplash.com/photo-1592656670491-ee81115eeaa7?auto=format&fit=crop&q=80&w=800";
                String pickleballImg = "https://images.unsplash.com/photo-1629731634341-2a62174360e2?auto=format&fit=crop&q=80&w=800";

                // Re-seed turfs with short fancy names & Coimbatore local areas
                turfRepository.deleteAll();
                turfRepository.saveAll(List.of(
                        new Turf(null, "Infinity Arena", "Ondipudur, Coimbatore", "Football", 1200.0, footballImg),
                        new Turf(null, "Spark Sports Hub", "Singanallur, Coimbatore", "Cricket", 900.0, cricketImg),
                        new Turf(null, "Turbo Turf", "Saravanampatti, Coimbatore", "Football", 1100.0, footballImg),
                        new Turf(null, "Apex Badminton", "Irugur, Coimbatore", "Badminton", 600.0, badmintonImg),
                        new Turf(null, "Velocity Arena", "Gandhipuram, Coimbatore", "Cricket", 850.0, cricketImg),
                        new Turf(null, "Pulse Sports Hub", "Peelamedu, Coimbatore", "Badminton", 550.0, badmintonImg),
                        new Turf(null, "Titan Court", "R.S. Puram, Coimbatore", "Tennis", 1000.0, tennisImg),
                        new Turf(null, "Matrix Basketball", "Race Course, Coimbatore", "Basketball", 700.0, basketballImg),
                        new Turf(null, "Spike Zone", "Ondipudur, Coimbatore", "Volleyball", 550.0, volleyballImg),
                        new Turf(null, "Pro Pickleball", "Saravanampatti, Coimbatore", "Pickleball", 600.0, pickleballImg)
                ));
        }
}
