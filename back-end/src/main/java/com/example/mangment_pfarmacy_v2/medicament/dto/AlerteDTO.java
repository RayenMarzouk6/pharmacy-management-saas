package com.example.mangment_pfarmacy_v2.medicament.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AlerteDTO {
    private UUID medicamentId;
    private String medicamentNom;
    private String type; // "STOCK_FAIBLE" or "EXPIRE_SOON"
    private LocalDate dateExpiration;
    private Integer quantiteStock;
    private Integer seuilAlerte;
}
