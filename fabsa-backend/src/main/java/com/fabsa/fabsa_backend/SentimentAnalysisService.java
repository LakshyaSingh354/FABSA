package com.fabsa.fabsa_backend;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class SentimentAnalysisService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String pythonApiUrl = "http://localhost:8000/analyze_sentiment";

    public SentimentData analyzeSentiment(String entity, String fromDate, String toDate, int numNews) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(pythonApiUrl)
            .queryParam("entity", entity)
            .queryParam("from_date", fromDate)
            .queryParam("to_date", toDate)
            .queryParam("num_news", numNews);

        ResponseEntity<SentimentData> response = restTemplate.getForEntity(builder.toUriString(), SentimentData.class);
        return response.getBody();
    }
}
