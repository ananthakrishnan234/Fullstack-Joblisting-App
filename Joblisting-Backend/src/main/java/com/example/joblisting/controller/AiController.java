package com.example.joblisting.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
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
 * Setup: Add ANTHROPIC_API_KEY to your environment variables or application.properties
 */
@RestController
@RequestMapping("/ai")
public class AiController {

    private static final Logger logger = LoggerFactory.getLogger(AiController.class);

    @Value("${anthropic.api.key:}")
    private String anthropicApiKey;

    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
    private static final String CLAUDE_MODEL = "claude-haiku-4-5-20251001";
    private static final String ANTHROPIC_VERSION = "2023-06-01";

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/enhance-description")
    public ResponseEntity<Map<String, String>> enhanceDescription(
            @RequestBody Map<String, String> request) {

        String rawDescription = request.get("description");
        String profile = request.getOrDefault("profile", "Software Developer");

        // ── Validate input ───────────────────────────────
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

        // ── Check API key is configured ──────────────────
        if (anthropicApiKey == null || anthropicApiKey.isBlank()) {
            logger.error("ANTHROPIC_API_KEY is not set in environment variables or application.properties");
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "AI service is not configured. Please set ANTHROPIC_API_KEY."));
        }

        logger.info("AI enhance request received for profile: {}", profile);

        // ── Build prompt ─────────────────────────────────
        String prompt = "You are a professional HR writer and technical recruiter. "
                + "Rewrite the following job description for the role of '"
                + profile
                + "' to make it clear, engaging, and attractive to qualified candidates. "
                + "Use professional language. Keep it concise (under 200 words). "
                + "Highlight key responsibilities and requirements naturally. "
                + "Return only the improved description — no preamble, no labels, no extra commentary.\n\n"
                + "Original description:\n" + rawDescription;

        // ── Build HTTP request ───────────────────────────
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", anthropicApiKey);
        headers.set("anthropic-version", ANTHROPIC_VERSION);

        Map<String, Object> body = new HashMap<>();
        body.put("model", CLAUDE_MODEL);
        body.put("max_tokens", 500);
        body.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // ── Call Claude API ──────────────────────────────
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    ANTHROPIC_API_URL,
                    entity,
                    Map.class
            );

            if (response.getBody() == null) {
                logger.error("Claude API returned null body");
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Empty response from Claude API"));
            }

            // Extract text from Claude response: content[0].text
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> content =
                    (List<Map<String, Object>>) response.getBody().get("content");

            if (content == null || content.isEmpty()) {
                logger.error("Claude API response had no content blocks. Full response: {}", response.getBody());
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "No content returned from Claude API"));
            }

            String enhancedText = (String) content.get(0).get("text");

            if (enhancedText == null || enhancedText.isBlank()) {
                logger.error("Claude API returned empty text");
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Claude returned empty text"));
            }

            logger.info("AI enhancement successful, response length: {} chars", enhancedText.length());
            return ResponseEntity.ok(Map.of("enhanced", enhancedText));

        } catch (HttpClientErrorException e) {
            // 4xx errors from Claude API — wrong key, bad request, etc.
            String responseBody = e.getResponseBodyAsString();
            logger.error("Claude API client error {}: {}", e.getStatusCode(), responseBody);

            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Invalid API key. Check your ANTHROPIC_API_KEY."));
            }
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Rate limit reached. Please try again in a moment."));
            }
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Claude model not found. Check the model name in AiController."));
            }
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Claude API error: " + e.getStatusCode() + " — " + responseBody));

        } catch (HttpServerErrorException e) {
            // 5xx errors from Claude API (Anthropic side issue)
            logger.error("Claude API server error {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Claude API is currently unavailable. Please try again later."));

        } catch (ResourceAccessException e) {
            // Network timeout or connection refused
            logger.error("Network error connecting to Claude API: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not connect to Claude API. Check your internet connection."));

        } catch (Exception e) {
            // Catch-all for any unexpected error
            logger.error("Unexpected error during AI enhancement: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Unexpected error: " + e.getMessage()));
        }
    }
}