package com.example.joblisting.repository;

import com.example.joblisting.model.Bookmark;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends MongoRepository<Bookmark, String> {

    List<Bookmark> findBySessionId(String sessionId);

    Optional<Bookmark> findBySessionIdAndJobId(String sessionId, String jobId);

    boolean existsBySessionIdAndJobId(String sessionId, String jobId);

    void deleteBySessionIdAndJobId(String sessionId, String jobId);

    long countBySessionId(String sessionId);
}