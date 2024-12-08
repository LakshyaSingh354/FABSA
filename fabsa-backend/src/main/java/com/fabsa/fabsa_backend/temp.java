package com.fabsa.fabsa_backend;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class temp {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println(encoder.encode("admin"));
    }
}
