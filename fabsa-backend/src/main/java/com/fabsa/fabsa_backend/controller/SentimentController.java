package com.fabsa.fabsa_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fabsa.fabsa_backend.authentication.JwtUtil;
import com.fabsa.fabsa_backend.database.HistoryRepository;
import com.fabsa.fabsa_backend.database.UserHistory;
import com.fabsa.fabsa_backend.service.SentimentResponse;
import com.fabsa.fabsa_backend.service.SentimentService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sentiment")
public class SentimentController {

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private SentimentService sentimentService;

    @GetMapping("/{entity}")
    public SentimentResponse analyzeSentiment(
            @PathVariable String entity,
            @RequestHeader("Auth") String token) throws Exception {
        try {
            // Extract user ID from token
            String userId = jwtUtil.extractUsername(token.substring(7));
            if (userId == null || userId.isEmpty()) {
                throw new Exception("Invalid token");
            }

            // Fetch sentiment (cached)
            String sentiment = sentimentService.getSentimentFromApi(entity);

            // Save history
            UserHistory history = new UserHistory(userId, entity, sentiment, "", LocalDateTime.now());
            historyRepository.save(history);

            // Create and return response
            return new SentimentResponse(entity, sentiment, userId);
        } catch (Exception e) {
            throw new Exception("Error processing sentiment", e);
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