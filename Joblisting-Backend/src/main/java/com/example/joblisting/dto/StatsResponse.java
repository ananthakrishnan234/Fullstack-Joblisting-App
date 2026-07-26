package com.example.joblisting.dto;

import java.util.Map;

public class StatsResponse {

    private long totalJobs;
    private double averageExperience;
    private int minExperience;
    private int maxExperience;
    private Map<String, Long> topTechnologies;
    private Map<String, Long> experienceDistribution;
    private Map<String, Long> topProfiles;

    public StatsResponse() {}

    public StatsResponse(long totalJobs, double averageExperience, int minExperience,
                         int maxExperience, Map<String, Long> topTechnologies,
                         Map<String, Long> experienceDistribution, Map<String, Long> topProfiles) {
        this.totalJobs = totalJobs;
        this.averageExperience = averageExperience;
        this.minExperience = minExperience;
        this.maxExperience = maxExperience;
        this.topTechnologies = topTechnologies;
        this.experienceDistribution = experienceDistribution;
        this.topProfiles = topProfiles;
    }

    public long getTotalJobs() { return totalJobs; }
    public double getAverageExperience() { return averageExperience; }
    public int getMinExperience() { return minExperience; }
    public int getMaxExperience() { return maxExperience; }
    public Map<String, Long> getTopTechnologies() { return topTechnologies; }
    public Map<String, Long> getExperienceDistribution() { return experienceDistribution; }
    public Map<String, Long> getTopProfiles() { return topProfiles; }
}