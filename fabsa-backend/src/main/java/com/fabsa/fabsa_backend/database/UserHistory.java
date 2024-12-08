package com.fabsa.fabsa_backend.database;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userHistory")
public class UserHistory {
    @Id
    private String id;
    private String userId;
    private String entity;
    private String currSentiment;
    private String histSentiment;
    private LocalDateTime timestamp;

    public UserHistory(String userId, String entity, String currSentiment, String histSentiment, LocalDateTime timestamp) {
        this.userId = userId;
        this.entity = entity;
        this.currSentiment = currSentiment;
        this.histSentiment = histSentiment;
        this.timestamp = timestamp;
    }

    public UserHistory() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getCurrSentiment() {
        return currSentiment;
    }

    public void setCurrSentiment(String currSentiment) {
        this.currSentiment = currSentiment;
    }

    public String getHistSentiment() {
        return histSentiment;
    }

    public void setHistSentiment(String histSentiment) {
        this.histSentiment = histSentiment;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}