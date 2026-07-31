package com.example.joblisting.auth.dto;

import java.util.Set;

/**
 * Returned by /auth/register and /auth/login.
 * Contains JWT access token + basic user info.
 */
public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private String id;
    private String name;
    private String email;
    private Set<String> roles;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String id,
                        String name, String email, Set<String> roles) {
        this.accessToken = accessToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
    }

    public String getAccessToken() { return accessToken; }
    public String getTokenType() { return tokenType; }
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Set<String> getRoles() { return roles; }
}