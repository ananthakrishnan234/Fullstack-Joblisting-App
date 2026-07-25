package com.example.joblisting.service;

import com.example.joblisting.dto.PostRequest;
import com.example.joblisting.dto.PostResponse;
import com.example.joblisting.model.Post;
import com.example.joblisting.repository.PostRepository;
import com.example.joblisting.repository.SearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private SearchRepository searchRepository;

    // Convert entity to response DTO
    private PostResponse toResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getProfile(),
                post.getDesc(),
                post.getExp(),
                post.getTechs()
        );
    }

    // Convert request DTO to entity
    private Post toEntity(PostRequest request) {
        Post post = new Post();
        post.setProfile(request.getProfile());
        post.setDesc(request.getDesc());
        post.setExp(request.getExp());
        post.setTechs(request.getTechs());
        return post;
    }

    public List<PostResponse> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findAll(pageable);
        return postPage.getContent()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<PostResponse> getPostById(String id) {
        return postRepository.findById(id).map(this::toResponse);
    }

    public PostResponse createPost(PostRequest request) {
        Post post = toEntity(request);
        Post saved = postRepository.save(post);
        return toResponse(saved);
    }

    public Optional<PostResponse> updatePost(String id, PostRequest request) {
        return postRepository.findById(id).map(existing -> {
            existing.setProfile(request.getProfile());
            existing.setDesc(request.getDesc());
            existing.setExp(request.getExp());
            existing.setTechs(request.getTechs());
            Post updated = postRepository.save(existing);
            return toResponse(updated);
        });
    }

    public boolean deletePost(String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<PostResponse> searchPosts(String text) {
        return searchRepository.findByText(text)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
