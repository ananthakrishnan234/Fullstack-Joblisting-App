package com.example.joblisting.controller;

import com.example.joblisting.dto.PostRequest;
import com.example.joblisting.dto.PostResponse;
import com.example.joblisting.exception.ResourceNotFoundException;
import com.example.joblisting.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class PostController {

    @Autowired
    private PostService postService;

    // GET /jobs?page=0&size=10
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getAllPosts(page, size));
    }

    // GET /jobs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getJobById(@PathVariable String id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id));
    }

    // POST /jobs
    @PostMapping
    public ResponseEntity<PostResponse> createJob(@Valid @RequestBody PostRequest request) {
        PostResponse created = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /jobs/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updateJob(
            @PathVariable String id,
            @Valid @RequestBody PostRequest request) {
        return postService.updatePost(id, request)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id));
    }

    // DELETE /jobs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable String id) {
        boolean deleted = postService.deletePost(id);
        if (!deleted) throw new ResourceNotFoundException("Job", id);
        return ResponseEntity.noContent().build();
    }

    // GET /jobs/search/{text}
    @GetMapping("/search/{text}")
    public ResponseEntity<List<PostResponse>> searchJobs(@PathVariable String text) {
        return ResponseEntity.ok(postService.searchPosts(text));
    }
}