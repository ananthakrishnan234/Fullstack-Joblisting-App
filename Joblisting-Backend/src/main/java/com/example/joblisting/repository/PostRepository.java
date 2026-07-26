package com.example.joblisting.repository;

import com.example.joblisting.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
    // MongoRepository provides all basic CRUD + findAll(Pageable) out of the box
}