package com.example.joblisting.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * User document stored in MongoDB "users" collection.
 *
 * Roles:
 *   ROLE_USER  — can browse, search, bookmark jobs
 *   ROLE_ADMIN — can also create, edit, delete jobs
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password; // BCrypt hashed — NEVER store plain text

    private Set<String> roles; // e.g. ["ROLE_USER"] or ["ROLE_USER", "ROLE_ADMIN"]

    private boolean enabled;

    @CreatedDate
    private LocalDateTime createdAt;
}