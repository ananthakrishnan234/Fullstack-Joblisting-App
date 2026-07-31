package com.example.joblisting.auth.service;

import com.example.joblisting.auth.dto.AuthResponse;
import com.example.joblisting.auth.dto.LoginRequest;
import com.example.joblisting.auth.dto.RegisterRequest;
import com.example.joblisting.auth.jwt.JwtUtils;
import com.example.joblisting.auth.model.User;
import com.example.joblisting.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    // ── Register ──────────────────────────────────────────────────
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of("ROLE_USER")) // all new users get ROLE_USER
                .enabled(true)
                .build();

        User saved = userRepository.save(user);

        // Generate JWT for the new user
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(saved.getEmail())
                .password(saved.getPassword())
                .authorities(saved.getRoles().stream()
                        .map(r -> new org.springframework.security.core.authority.SimpleGrantedAuthority(r))
                        .toList())
                .build();

        String token = jwtUtils.generateToken(userDetails);

        return new AuthResponse(token, saved.getId(),
                saved.getName(), saved.getEmail(), saved.getRoles());
    }

    // ── Login ─────────────────────────────────────────────────────
    public AuthResponse login(LoginRequest request) {

        // This throws AuthenticationException if credentials are wrong
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtils.generateToken(userDetails);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(token, user.getId(),
                user.getName(), user.getEmail(), user.getRoles());
    }

    // ── Get current user profile ──────────────────────────────────
    public AuthResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(null, user.getId(),
                user.getName(), user.getEmail(), user.getRoles());
    }
}