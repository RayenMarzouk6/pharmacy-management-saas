package com.example.mangment_pfarmacy_v2.medicament.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Data;

@Data
public class MedicamentDTO {
    private Long id;
    private String nom;
    private String imageUrl;
    private String description;
    private Double prix;
    private Integer quantiteStock;
    private Integer seuilAlerte;
    private LocalDate dateExpiration;
    private String codeBarres;
    private UUID fournisseurId;
}
