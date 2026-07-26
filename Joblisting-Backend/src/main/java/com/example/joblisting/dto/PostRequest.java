package com.example.joblisting.dto;

import jakarta.validation.constraints.*;

public class PostRequest {

    @NotBlank(message = "Profile/job title is required")
    @Size(min = 2, max = 100, message = "Profile must be between 2 and 100 characters")
    private String profile;

    @NotBlank(message = "Job description is required")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    private String desc;

    @Min(value = 0, message = "Experience cannot be negative")
    @Max(value = 50, message = "Experience seems unrealistic above 50 years")
    private int exp;

    @NotNull(message = "Technologies list is required")
    @Size(min = 1, message = "At least one technology must be specified")
    private String[] techs;

    public String getProfile() { return profile; }
    public void setProfile(String profile) { this.profile = profile; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }

    public int getExp() { return exp; }
    public void setExp(int exp) { this.exp = exp; }

    public String[] getTechs() { return techs; }
    public void setTechs(String[] techs) { this.techs = techs; }
}