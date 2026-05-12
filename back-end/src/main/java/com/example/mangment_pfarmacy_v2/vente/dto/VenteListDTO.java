package com.example.mangment_pfarmacy_v2.vente.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.mangment_pfarmacy_v2.vente.enums.StatutVente;

import lombok.Data;

@Data
public class VenteListDTO {
    private UUID id;
    private LocalDateTime createdAt;
    private LocalDateTime dateVente;
    private Double montantTotal;
    private StatutVente statut;
    private int nombreLignes;
    private String utilisateurNom;
}