package com.fabsa.fabsa_backend.service;

import org.springframework.http.HttpHeaders;
import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SentimentService {

    private final RestTemplate restTemplate;

    public SentimentService(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public String analyzeSentiment(String entity) {
        String pythonApiUrl = "http://python-model:8000/analyze";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        
        Map<String, String> request = new HashMap<>();
        request.put("entity", entity);

        HttpEntity<Map<String, String>> entityRequest = new HttpEntity<>(request, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(pythonApiUrl, entityRequest, String.class);
        return response.getBody();
    }

    @Cacheable(value = "sentiment", key = "#entity")
    public String getSentimentFromApi(String entity) {
        // Fetch sentiment from Python API
        String pythonApiUrl = "http://python-model:8000/analyze?entity=" + entity;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> pythonResponse = restTemplate.getForEntity(pythonApiUrl, String.class);
        return pythonResponse.getBody();
    }

    @Cacheable(value = "histSentiment", key = "#entity")
    public String getHistSentiment(String entity){
        String apiUrl = "http://python-model:8000/historical_sentiment?entity=" + entity;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);
        return response.getBody();
    }
}
