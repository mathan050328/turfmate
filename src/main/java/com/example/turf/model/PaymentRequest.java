package com.example.turf.model;

import lombok.Data;

@Data
public class PaymentRequest {
    private String turfId;
    private String userId;
    private String time;
    private String date;
}
