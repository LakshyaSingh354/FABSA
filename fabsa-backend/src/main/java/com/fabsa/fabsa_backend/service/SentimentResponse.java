package com.fabsa.fabsa_backend.service;

import java.io.Serializable;

public class SentimentResponse implements Serializable {
    private String entity;
    private String sentiment;
    private String userId;

    // Default constructor
    public SentimentResponse() {}

    // All-args constructor
    public SentimentResponse(String entity, String sentiment, String userId) {
        this.entity = entity;
        this.sentiment = sentiment;
        this.userId = userId;
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
}