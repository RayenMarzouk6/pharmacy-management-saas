package com.example.mangment_pfarmacy_v2.payment.dto;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Data;

@Data
public class FlouciVerifyResponseDTO {
    private boolean verified;
    private JsonNode rawResponse;
}