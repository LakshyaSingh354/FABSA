package com.fabsa.fabsa_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/v1/sentiment")
public class SentimentController {

    @GetMapping("/{entity}")
    public ResponseEntity<String> analyzeSentiment(@PathVariable String entity) {
        try {
            // Make HTTP call to Python API
            String pythonApiUrl = "http://localhost:8000/analyze?entity=" + entity;
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> pythonResponse = restTemplate.getForEntity(pythonApiUrl, String.class);

            // Return Python API response to client
            return ResponseEntity.ok(pythonResponse.getBody());
        } catch (Exception e) {
            // Handle errors and return meaningful response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calling Python API: " + e.getMessage());
        }
    }
}