package com.example.joblisting.controller;

import com.example.joblisting.dto.FilterRequest;
import com.example.joblisting.dto.PostResponse;
import com.example.joblisting.dto.StatsResponse;
import com.example.joblisting.service.FilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class FilterController {

    @Autowired
    private FilterService filterService;

    /**
     * POST /jobs/filter?page=0&size=10
     *
     * Request body (all fields optional):
     * {
     *   "minExp": 2,
     *   "maxExp": 6,
     *   "techs": ["react", "java"],
     *   "profile": "developer"
     * }
     */
    @PostMapping("/filter")
    public ResponseEntity<List<PostResponse>> filterJobs(
            @RequestBody FilterRequest filterRequest,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(filterService.filterJobs(filterRequest, page, size));
    }

    /**
     * GET /jobs/stats
     * Returns dashboard statistics: total jobs, avg exp, top techs, distributions
     */
    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(filterService.getStats());
    }
}