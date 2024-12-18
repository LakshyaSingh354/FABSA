package com.fabsa.fabsa_backend.service;

import java.io.Serializable;

public class SentimentResponse implements Serializable {
    private String entity;
    private String sentiment;
    private String userId;
    private String id;

    // Default constructor
    public SentimentResponse() {}

    // All-args constructor
    public SentimentResponse(String entity, String sentiment, String userId, String id) {
        this.entity = entity;
        this.sentiment = sentiment;
        this.userId = userId;
        this.id = id;
    }

    // Getters and setters
    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}