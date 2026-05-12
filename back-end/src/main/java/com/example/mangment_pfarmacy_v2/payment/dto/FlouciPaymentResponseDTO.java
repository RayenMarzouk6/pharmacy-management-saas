package com.example.mangment_pfarmacy_v2.payment.dto;

import java.util.UUID;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Data;

@Data
public class FlouciPaymentResponseDTO {
    private UUID planId;
    private String planName;
    private double amount;
    private String paymentId;
    private String paymentUrl;
    private JsonNode rawResponse;
}