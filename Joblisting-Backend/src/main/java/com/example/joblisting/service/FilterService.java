package com.example.joblisting.service;

import com.example.joblisting.dto.FilterRequest;
import com.example.joblisting.dto.PostResponse;
import com.example.joblisting.dto.StatsResponse;
import com.example.joblisting.model.Post;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FilterService {

    @Autowired
    private MongoClient mongoClient;

    @Autowired
    private MongoConverter mongoConverter;

    @Value("${spring.data.mongodb.database}")
    private String databaseName;

    private static final String COLLECTION_NAME = "joblisting";

    // ─── Advanced Filtering ───────────────────────────

    public List<PostResponse> filterJobs(FilterRequest filter, int page, int size) {
        List<Document> pipeline = new ArrayList<>();
        Document matchConditions = new Document();

        if (filter.getMinExp() != null || filter.getMaxExp() != null) {
            Document expRange = new Document();
            if (filter.getMinExp() != null) expRange.append("$gte", filter.getMinExp());
            if (filter.getMaxExp() != null) expRange.append("$lte", filter.getMaxExp());
            matchConditions.append("exp", expRange);
        }

        if (filter.getTechs() != null && !filter.getTechs().isEmpty()) {
            List<Document> techConditions = filter.getTechs().stream()
                    .map(tech -> new Document("techs",
                            new Document("$regex", tech).append("$options", "i")))
                    .collect(Collectors.toList());
            matchConditions.append("$and", techConditions);
        }

        if (filter.getProfile() != null && !filter.getProfile().isBlank()) {
            matchConditions.append("profile",
                    new Document("$regex", filter.getProfile()).append("$options", "i"));
        }

        if (!matchConditions.isEmpty()) {
            pipeline.add(new Document("$match", matchConditions));
        }

        pipeline.add(new Document("$sort", new Document("exp", 1)));
        pipeline.add(new Document("$skip", (long) page * size));
        pipeline.add(new Document("$limit", (long) size));

        MongoDatabase db = mongoClient.getDatabase(databaseName);
        MongoCollection<Document> collection = db.getCollection(COLLECTION_NAME);

        List<PostResponse> results = new ArrayList<>();
        collection.aggregate(pipeline).forEach(doc -> {
            Post post = mongoConverter.read(Post.class, doc);
            results.add(toResponse(post));
        });

        return results;
    }

    // ─── Statistics Dashboard ─────────────────────────

    public StatsResponse getStats() {
        MongoDatabase db = mongoClient.getDatabase(databaseName);
        MongoCollection<Document> collection = db.getCollection(COLLECTION_NAME);

        List<Post> allPosts = new ArrayList<>();
        collection.find().forEach(doc -> allPosts.add(mongoConverter.read(Post.class, doc)));

        if (allPosts.isEmpty()) {
            return new StatsResponse(0, 0, 0, 0,
                    Collections.emptyMap(), Collections.emptyMap(), Collections.emptyMap());
        }

        long totalJobs = allPosts.size();

        IntSummaryStatistics expStats = allPosts.stream()
                .mapToInt(Post::getExp)
                .summaryStatistics();

        double averageExperience = Math.round(expStats.getAverage() * 10.0) / 10.0;
        int minExperience = expStats.getMin();
        int maxExperience = expStats.getMax();

        Map<String, Long> topTechnologies = allPosts.stream()
                .filter(p -> p.getTechs() != null)
                .flatMap(p -> Arrays.stream(p.getTechs()))
                .map(String::toLowerCase)
                .collect(Collectors.groupingBy(t -> t, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));

        Map<String, Long> experienceDistribution = new LinkedHashMap<>();
        experienceDistribution.put("0-2 yrs", allPosts.stream().filter(p -> p.getExp() <= 2).count());
        experienceDistribution.put("3-5 yrs", allPosts.stream().filter(p -> p.getExp() >= 3 && p.getExp() <= 5).count());
        experienceDistribution.put("6-9 yrs", allPosts.stream().filter(p -> p.getExp() >= 6 && p.getExp() <= 9).count());
        experienceDistribution.put("10+ yrs", allPosts.stream().filter(p -> p.getExp() >= 10).count());

        Map<String, Long> topProfiles = allPosts.stream()
                .filter(p -> p.getProfile() != null)
                .collect(Collectors.groupingBy(p -> p.getProfile().trim(), Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(8)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));

        return new StatsResponse(totalJobs, averageExperience, minExperience,
                maxExperience, topTechnologies, experienceDistribution, topProfiles);
    }

    private PostResponse toResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getProfile(),
                post.getDesc(),
                post.getExp(),
                post.getTechs()
        );
    }
}
