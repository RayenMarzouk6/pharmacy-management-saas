package com.example.mangment_pfarmacy_v2.pharmacie.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class PharmacieDTO {
    private UUID id;
    private String nom;
    private String adresse;
    private String telephone;
    private String tenantId;
}
