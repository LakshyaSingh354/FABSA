package com.fabsa.fabsa_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fabsa.fabsa_backend.authentication.JwtUtil;
import com.fabsa.fabsa_backend.database.HistoryRepository;
import com.fabsa.fabsa_backend.database.UserHistory;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sentiment")
public class SentimentController {

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/{entity}")
    public ResponseEntity<String> analyzeSentiment(@PathVariable String entity, @RequestHeader("Auth") String token) {
        try {
            // String token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTczMzYwNDAwOCwiZXhwIjoxNzMzNjQwMDA4fQ.knwsDsfetbeKI-x-dGN7Dhpi75qcSlOTnMRHx8oy9xk";
            String pythonApiUrl = "http://localhost:8000/analyze?entity=" + entity;
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> pythonResponse = restTemplate.getForEntity(pythonApiUrl, String.class);
            System.out.println("Sentiment Retrieved Successfully");
            // Extract user ID from JWT token
            System.out.println(
                    "Token: " + token.substring(7) + " | Username: " + jwtUtil.extractUsername(token.substring(7))
            );
            String userId = jwtUtil.extractUsername(token.substring(7)); // Remove "Bearer " prefix

            // Call the Python API

            // Extract sentiment from Python API response
            String sentiment = pythonResponse.getBody();

            // Save history in MongoDB
            UserHistory history = new UserHistory(userId, entity, sentiment, "", LocalDateTime.now());
            historyRepository.save(history);

            // Return Python API response to client
            return ResponseEntity.ok(String.format("{\"entity\": \"%s\", \"sentiment\": %s, \"userId\": %s}", entity, sentiment, userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error calling Python API: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestHeader("Auth") String token) {
        try {
            // Extract user ID from JWT token
            String userId = jwtUtil.extractUsername(token.substring(7)); // Remove "Bearer " prefix

            // Retrieve user history from MongoDB
            List<UserHistory> userHistory = historyRepository.findByUserId(userId);

            return ResponseEntity.ok(userHistory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving history: " + e.getMessage());
        }
    }
}