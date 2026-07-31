package com.example.joblisting.auth.controller;

import com.example.joblisting.auth.dto.AuthResponse;
import com.example.joblisting.auth.dto.LoginRequest;
import com.example.joblisting.auth.dto.RegisterRequest;
import com.example.joblisting.auth.service.AuthService;
import com.example.joblisting.exception.ApiError;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Auth endpoints:
 *   POST /auth/register  — create account, returns JWT
 *   POST /auth/login     — login, returns JWT
 *   GET  /auth/me        — get current user profile (requires token)
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ── POST /auth/register ───────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiError(409, e.getMessage()));
        }
    }

    // ── POST /auth/login ──────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiError(401, "Invalid email or password"));
        }
    }

    // ── GET /auth/me ──────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        AuthResponse profile = authService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }
}