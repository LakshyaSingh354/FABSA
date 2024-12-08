package com.fabsa.fabsa_backend.service;

import org.springframework.http.HttpHeaders;
import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.web.client.RestTemplateBuilder;
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
        String pythonApiUrl = "http://localhost:8000/analyze";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        
        Map<String, String> request = new HashMap<>();
        request.put("entity", entity);

        HttpEntity<Map<String, String>> entityRequest = new HttpEntity<>(request, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(pythonApiUrl, entityRequest, String.class);
        return response.getBody();
    }
}
