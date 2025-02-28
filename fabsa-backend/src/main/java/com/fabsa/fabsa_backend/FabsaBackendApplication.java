package com.fabsa.fabsa_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.fabsa.fabsa_backend.database")
@SpringBootApplication
@EnableCaching
public class FabsaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FabsaBackendApplication.class, args);
	}

}
