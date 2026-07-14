package com.example.turf.repository;

import com.example.turf.model.Turf;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TurfRepository extends MongoRepository<Turf, String> {
    List<Turf> findBySportType(String sportType);
}
