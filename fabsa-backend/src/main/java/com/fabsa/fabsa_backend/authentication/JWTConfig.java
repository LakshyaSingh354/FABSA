package com.fabsa.fabsa_backend.authentication;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Configuration
public class JWTConfig {

    // @Value("${jwt.secret}")
    private String secret = "somethingSecReTtoCreateTokenwiTh";

    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil(Keys.hmacShaKeyFor(secret.getBytes())); // Replace "your_secret_key" with the actual key
    }
}

