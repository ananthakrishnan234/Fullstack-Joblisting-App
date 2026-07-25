package com.example.joblisting.dto;

import java.util.Arrays;

public class PostResponse {

    private String id;
    private String profile;
    private String desc;
    private int exp;
    private String[] techs;

    public PostResponse() {}

    public PostResponse(String id, String profile, String desc, int exp, String[] techs) {
        this.id = id;
        this.profile = profile;
        this.desc = desc;
        this.exp = exp;
        this.techs = techs;
    }

    public String getId() { return id; }
    public String getProfile() { return profile; }
    public String getDesc() { return desc; }
    public int getExp() { return exp; }
    public String[] getTechs() { return techs; }

    @Override
    public String toString() {
        return "PostResponse{id='" + id + "', profile='" + profile + "', exp=" + exp + ", techs=" + Arrays.toString(techs) + "}";
    }
}
