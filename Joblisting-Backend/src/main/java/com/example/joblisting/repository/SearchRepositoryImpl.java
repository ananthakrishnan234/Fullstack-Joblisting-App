package com.example.joblisting.repository;

import com.example.joblisting.model.Post;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * SearchRepositoryImpl — Dual-mode search implementation.
 *
 * PRIMARY:  MongoDB Atlas $search (full-text, requires Atlas Search index named "default")
 * FALLBACK: MongoDB $regex search (works on ALL tiers, no index setup needed)
 *
 * If Atlas Search index is not set up or throws an error,
 * it automatically falls back to regex search so the app never breaks.
 *
 * HOW TO SET UP ATLAS SEARCH INDEX (for primary search):
 *  1. Go to MongoDB Atlas → your cluster → "Atlas Search" tab
 *  2. Click "Create Search Index" → choose "JSON Editor"
 *  3. Select database: jobapidb, collection: joblisting
 *  4. Name: default
 *  5. Paste this definition:
 *     {
 *       "mappings": {
 *         "dynamic": false,
 *         "fields": {
 *           "profile": { "type": "string", "analyzer": "lucene.standard" },
 *           "desc":    { "type": "string", "analyzer": "lucene.standard" },
 *           "techs":   { "type": "string", "analyzer": "lucene.standard" }
 *         }
 *       }
 *     }
 *  6. Click Create. Wait 1-2 minutes for it to build.
 */
@Component
public class SearchRepositoryImpl implements SearchRepository {

    private static final Logger logger = LoggerFactory.getLogger(SearchRepositoryImpl.class);

    @Autowired
    MongoClient client;

    @Autowired
    MongoConverter converter;

    @Value("${spring.data.mongodb.database}")
    private String databaseName;

    private static final String COLLECTION_NAME = "joblisting";
    private static final int SEARCH_RESULT_LIMIT = 20;

    @Override
    public List<Post> findByText(String text) {
        try {
            // Try Atlas $search first
            return atlasSearch(text);
        } catch (Exception e) {
            logger.warn("Atlas $search failed (index may not be set up): {}. Falling back to regex search.", e.getMessage());
            // Fall back to regex search — works on all MongoDB tiers
            return regexSearch(text);
        }
    }

    // ── Atlas Full-Text Search (requires Search Index) ──────────────
    private List<Post> atlasSearch(String text) {
        final List<Post> posts = new ArrayList<>();

        MongoDatabase database = client.getDatabase(databaseName);
        MongoCollection<Document> collection = database.getCollection(COLLECTION_NAME);

        collection.aggregate(Arrays.asList(
                new Document("$search",
                        new Document("index", "default")
                                .append("text",
                                        new Document("query", text)
                                                .append("path", Arrays.asList("profile", "desc", "techs"))
                                )
                ),
                new Document("$sort", new Document("exp", 1L)),
                new Document("$limit", (long) SEARCH_RESULT_LIMIT)
        )).forEach(doc -> posts.add(converter.read(Post.class, doc)));

        logger.info("Atlas search for '{}' returned {} results", text, posts.size());
        return posts;
    }

    // ── Regex Search (fallback — no index needed) ────────────────────
    private List<Post> regexSearch(String text) {
        final List<Post> posts = new ArrayList<>();

        MongoDatabase database = client.getDatabase(databaseName);
        MongoCollection<Document> collection = database.getCollection(COLLECTION_NAME);

        // Case-insensitive regex match on profile, desc, and techs array
        Document regexCondition = new Document("$regex", text).append("$options", "i");

        Document matchStage = new Document("$match",
                new Document("$or", Arrays.asList(
                        new Document("profile", regexCondition),
                        new Document("desc", regexCondition),
                        new Document("techs", regexCondition)
                ))
        );

        collection.aggregate(Arrays.asList(
                matchStage,
                new Document("$sort", new Document("exp", 1L)),
                new Document("$limit", (long) SEARCH_RESULT_LIMIT)
        )).forEach(doc -> posts.add(converter.read(Post.class, doc)));

        logger.info("Regex search for '{}' returned {} results", text, posts.size());
        return posts;
    }
}