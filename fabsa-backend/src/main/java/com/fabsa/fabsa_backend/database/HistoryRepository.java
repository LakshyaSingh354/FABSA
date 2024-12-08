package com.fabsa.fabsa_backend.database;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends MongoRepository<UserHistory, String> {
    List<UserHistory> findByUserId(String userId);
}