package com.example.joblisting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookmarks")
@CompoundIndex(name = "session_job_idx", def = "{'sessionId': 1, 'jobId': 1}", unique = true)
public class Bookmark {

    @Id
    private String id;

    // Frontend generates a UUID once and stores it in localStorage
    private String sessionId;

    // The _id of the bookmarked Post document
    private String jobId;

    @CreatedDate
    private LocalDateTime bookmarkedAt;
}