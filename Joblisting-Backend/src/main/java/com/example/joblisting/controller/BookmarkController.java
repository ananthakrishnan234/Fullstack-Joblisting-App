package com.example.joblisting.controller;

import com.example.joblisting.dto.PostResponse;
import com.example.joblisting.model.Bookmark;
import com.example.joblisting.service.BookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * All bookmark endpoints use the X-Session-Id header.
 * The frontend generates a UUID once and stores it in localStorage.
 */
@RestController
@RequestMapping("/bookmarks")
public class BookmarkController {

    private static final String SESSION_HEADER = "X-Session-Id";

    @Autowired
    private BookmarkService bookmarkService;

    // GET /bookmarks — all bookmarked jobs for this session
    @GetMapping
    public ResponseEntity<List<PostResponse>> getBookmarks(
            @RequestHeader(SESSION_HEADER) String sessionId) {
        return ResponseEntity.ok(bookmarkService.getBookmarkedJobs(sessionId));
    }

    // GET /bookmarks/ids — just the job IDs (lightweight sync)
    @GetMapping("/ids")
    public ResponseEntity<List<String>> getBookmarkIds(
            @RequestHeader(SESSION_HEADER) String sessionId) {
        return ResponseEntity.ok(bookmarkService.getBookmarkedJobIds(sessionId));
    }

    // POST /bookmarks/{jobId} — bookmark a job
    @PostMapping("/{jobId}")
    public ResponseEntity<Bookmark> addBookmark(
            @RequestHeader(SESSION_HEADER) String sessionId,
            @PathVariable String jobId) {
        Bookmark bookmark = bookmarkService.addBookmark(sessionId, jobId);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookmark);
    }

    // DELETE /bookmarks/{jobId} — remove a bookmark
    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> removeBookmark(
            @RequestHeader(SESSION_HEADER) String sessionId,
            @PathVariable String jobId) {
        bookmarkService.removeBookmark(sessionId, jobId);
        return ResponseEntity.noContent().build();
    }

    // GET /bookmarks/{jobId}/check — is this job bookmarked?
    @GetMapping("/{jobId}/check")
    public ResponseEntity<Map<String, Boolean>> checkBookmark(
            @RequestHeader(SESSION_HEADER) String sessionId,
            @PathVariable String jobId) {
        boolean bookmarked = bookmarkService.isBookmarked(sessionId, jobId);
        return ResponseEntity.ok(Map.of("bookmarked", bookmarked));
    }
}