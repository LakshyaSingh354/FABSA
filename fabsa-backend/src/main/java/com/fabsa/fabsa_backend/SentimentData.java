package com.fabsa.fabsa_backend;

import java.util.List;
import java.util.Map;

public class SentimentData {
    private List<String> individualSentiments;
    private Map<String, Double> aggregatedSentiments;
    private Double sentimentScore;
    private List<List<Double>> probabilities;

    // Getters and Setters

    public List<String> getIndividualSentiments() {
        return individualSentiments;
    }

    public void setIndividualSentiments(List<String> individualSentiments) {
        this.individualSentiments = individualSentiments;
    }

    public Map<String, Double> getAggregatedSentiments() {
        return aggregatedSentiments;
    }

    public void setAggregatedSentiments(Map<String, Double> aggregatedSentiments) {
        this.aggregatedSentiments = aggregatedSentiments;
    }

    public Double getSentimentScore() {
        return sentimentScore;
    }

    public void setSentimentScore(Double sentimentScore) {
        this.sentimentScore = sentimentScore;
    }

    public List<List<Double>> getProbabilities() {
        return probabilities;
    }

    public void setProbabilities(List<List<Double>> probabilities) {
        this.probabilities = probabilities;
    }

    // toString

    @Override
    public String toString() {
        return "SentimentData{" +
                "individualSentiments=" + individualSentiments +
                ", aggregatedSentiments=" + aggregatedSentiments +
                ", sentimentScore=" + sentimentScore +
                ", probabilities=" + probabilities +
                '}';
    }

}
