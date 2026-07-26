package com.example.joblisting.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AiController — AI-powered job description enhancement using Claude API.
 *
 * Endpoint: POST /ai/enhance-description
 *
 * Request body:
 * {
 *   "description": "We need a java dev who can do stuff",
 *   "profile": "Senior Java Developer"
 * }
 *
 * Response:
 * {
 *   "enhanced": "We are seeking a Senior Java Developer to join our team..."
 * }
 *
 * To enable: set ANTHROPIC_API_KEY in your .env file.
 * Get your key at: https://console.anthropic.com
 */
@RestController
@RequestMapping("/ai")
public class AiController {

    @Value("${anthropic.api.key:}")
    private String anthropicApiKey;

    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
    private static final String CLAUDE_MODEL = "claude-haiku-4-5-20251001";

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/enhance-description")
    public ResponseEntity<Map<String, String>> enhanceDescription(
            @RequestBody Map<String, String> request) {

        String rawDescription = request.get("description");
        String profile = request.getOrDefault("profile", "Software Developer");

        // Validate input
        if (rawDescription == null || rawDescription.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Description is required"));
        }

        if (rawDescription.trim().length() < 10) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Description must be at least 10 characters"));
        }

        // Check API key configured
        if (anthropicApiKey == null || anthropicApiKey.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "AI service is not configured. Please set ANTHROPIC_API_KEY."));
        }

        // Build prompt
        String prompt = "You are a professional HR writer and technical recruiter. "
                + "Rewrite the following job description for the role of '"
                + profile
                + "' to make it clear, engaging, and attractive to qualified candidates. "
                + "Use professional language. Keep it concise (under 200 words). "
                + "Highlight key responsibilities and requirements naturally. "
                + "Return only the improved description — no preamble, no labels, no extra commentary.\n\n"
                + "Original description:\n" + rawDescription;

        // Build request headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", anthropicApiKey);
        headers.set("anthropic-version", "2023-06-01");

        // Build request body
        Map<String, Object> body = new HashMap<>();
        body.put("model", CLAUDE_MODEL);
        body.put("max_tokens", 500);
        body.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    ANTHROPIC_API_URL,
                    entity,
                    Map.class
            );

            if (response.getBody() == null) {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Empty response from AI service"));
            }

            // Extract text from Claude's response content array
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> content =
                    (List<Map<String, Object>>) response.getBody().get("content");

            if (content == null || content.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "No content in AI response"));
            }

            String enhancedText = (String) content.get(0).get("text");

            return ResponseEntity.ok(Map.of("enhanced", enhancedText));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "AI enhancement failed. Please try again later."));
        }
    }
}