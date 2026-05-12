package com.example.mangment_pfarmacy_v2.dashboard.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PharmacySalesSummaryDTO {
    private UUID pharmacieId;
    private String pharmacieNom;
    private long totalVentes;
    private Double totalMontant;
}