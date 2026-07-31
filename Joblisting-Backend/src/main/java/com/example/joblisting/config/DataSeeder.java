package com.example.joblisting.config;

import com.example.joblisting.auth.model.User;
import com.example.joblisting.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (!userRepository.existsByEmail("admin@example.com")) {

            User admin = User.builder()
                    .name("Administrator")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .roles(Set.of("ROLE_ADMIN"))
                    .enabled(true)
                    .build();

            userRepository.save(admin);

            System.out.println("Admin user created.");
        }
    }
}