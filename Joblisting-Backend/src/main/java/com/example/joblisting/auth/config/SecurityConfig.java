package com.example.joblisting.auth.config;

import com.example.joblisting.auth.service.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.example.joblisting.auth.jwt.JwtAuthenticationFilter;
import java.util.List;
import java.util.Map;

/**
 * Spring Security configuration.
 *
 * PUBLIC endpoints (no token needed):
 *   POST /auth/register
 *   POST /auth/login
 *   GET  /jobs/**          (anyone can browse/search jobs)
 *   GET  /jobs/stats
 *   GET  /swagger-ui.html, /api-docs/**
 *
 * USER endpoints (ROLE_USER required):
 *   GET/POST /bookmarks/**
 *   POST     /ai/enhance-description
 *
 * ADMIN endpoints (ROLE_ADMIN required):
 *   POST   /jobs          (create job)
 *   PUT    /jobs/**       (edit job)
 *   DELETE /jobs/**       (delete job)
 *   POST   /jobs/filter
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173",
                "https://fullstack-joblisting-app.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Use our CORS config (replaces the old CorsConfig.java)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disable CSRF — we use JWT (stateless), no session cookies
                .csrf(AbstractHttpConfigurer::disable)

                // Stateless session — Spring Security will not create HTTP sessions
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Custom 401 response (instead of redirect to /login)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            new ObjectMapper().writeValue(response.getOutputStream(),
                                    Map.of(
                                            "status", 401,
                                            "error", "Unauthorized",
                                            "message", "You must be logged in to access this resource"
                                    ));
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            new ObjectMapper().writeValue(response.getOutputStream(),
                                    Map.of(
                                            "status", 403,
                                            "error", "Forbidden",
                                            "message", "You don't have permission to perform this action"
                                    ));
                        })
                )

                // ── Route-based access rules ──────────────────────────
                .authorizeHttpRequests(auth -> auth

                        // Allow CORS preflight requests
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // Public — no token needed
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**",
                                "/api-docs", "/api-docs/**").permitAll()

                        // Public read — anyone can browse jobs
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET, "/jobs/**"
                        ).permitAll()
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET, "/jobs"
                        ).permitAll()

                        // Filter is a POST but should be public (browsing feature)
                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST, "/jobs/filter"
                        ).permitAll()

                        // Admin only — create, edit, delete jobs
                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST, "/jobs"
                        ).hasRole("ADMIN")
                        .requestMatchers(
                                org.springframework.http.HttpMethod.PUT, "/jobs/**"
                        ).hasRole("ADMIN")
                        .requestMatchers(
                                org.springframework.http.HttpMethod.DELETE, "/jobs/**"
                        ).hasRole("ADMIN")

                        // User + Admin — bookmarks and AI
                        .requestMatchers("/bookmarks/**").authenticated()
                        .requestMatchers("/ai/**").authenticated()

                        // Auth — profile endpoint
                        .requestMatchers("/auth/me").authenticated()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                // Register our authentication provider
                .authenticationProvider(authenticationProvider())

                // Add JWT filter BEFORE Spring's username/password filter
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
