package com.example.turf.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "turf")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Turf {
    @Id
    private String id;

    private String name;

    private String location;

    private String sportType; // e.g., "Football", "Cricket"

    private Double pricePerHour;

    private String imageUrl;
}
