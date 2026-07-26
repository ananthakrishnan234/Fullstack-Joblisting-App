package com.example.joblisting.dto;

import java.util.List;

/**
 * DTO for advanced job filtering.
 * All fields are optional — null means "no filter on this field".
 */
public class FilterRequest {

    private Integer minExp;
    private Integer maxExp;
    private List<String> techs;
    private String profile;

    public FilterRequest() {}

    public Integer getMinExp() { return minExp; }
    public void setMinExp(Integer minExp) { this.minExp = minExp; }

    public Integer getMaxExp() { return maxExp; }
    public void setMaxExp(Integer maxExp) { this.maxExp = maxExp; }

    public List<String> getTechs() { return techs; }
    public void setTechs(List<String> techs) { this.techs = techs; }

    public String getProfile() { return profile; }
    public void setProfile(String profile) { this.profile = profile; }
}
