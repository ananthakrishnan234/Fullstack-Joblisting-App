package com.example.joblisting.service;

import com.example.joblisting.dto.PostResponse;
import com.example.joblisting.exception.ResourceNotFoundException;
import com.example.joblisting.model.Bookmark;
import com.example.joblisting.model.Post;
import com.example.joblisting.repository.BookmarkRepository;
import com.example.joblisting.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private PostRepository postRepository;

    public Bookmark addBookmark(String sessionId, String jobId) {
        if (!postRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job", jobId);
        }
        return bookmarkRepository.findBySessionIdAndJobId(sessionId, jobId)
                .orElseGet(() -> {
                    Bookmark bookmark = new Bookmark();
                    bookmark.setSessionId(sessionId);
                    bookmark.setJobId(jobId);
                    return bookmarkRepository.save(bookmark);
                });
    }

    @Transactional
    public void removeBookmark(String sessionId, String jobId) {
        if (!bookmarkRepository.existsBySessionIdAndJobId(sessionId, jobId)) {
            throw new ResourceNotFoundException("Bookmark", jobId);
        }
        bookmarkRepository.deleteBySessionIdAndJobId(sessionId, jobId);
    }

    public boolean isBookmarked(String sessionId, String jobId) {
        return bookmarkRepository.existsBySessionIdAndJobId(sessionId, jobId);
    }

    public List<PostResponse> getBookmarkedJobs(String sessionId) {
        List<Bookmark> bookmarks = bookmarkRepository.findBySessionId(sessionId);
        List<String> jobIds = bookmarks.stream()
                .map(Bookmark::getJobId)
                .collect(Collectors.toList());

        List<Post> posts = postRepository.findAllById(jobIds);
        Map<String, Post> postMap = posts.stream()
                .collect(Collectors.toMap(Post::getId, p -> p));

        return jobIds.stream()
                .filter(postMap::containsKey)
                .map(id -> {
                    Post p = postMap.get(id);
                    return new PostResponse(p.getId(), p.getProfile(), p.getDesc(), p.getExp(), p.getTechs());
                })
                .collect(Collectors.toList());
    }

    public List<String> getBookmarkedJobIds(String sessionId) {
        return bookmarkRepository.findBySessionId(sessionId)
                .stream()
                .map(Bookmark::getJobId)
                .collect(Collectors.toList());
    }

    public long getBookmarkCount(String sessionId) {
        return bookmarkRepository.countBySessionId(sessionId);
    }
}