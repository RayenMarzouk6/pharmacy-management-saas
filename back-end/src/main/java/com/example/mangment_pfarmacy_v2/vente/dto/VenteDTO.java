package com.example.mangment_pfarmacy_v2.vente.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.example.mangment_pfarmacy_v2.vente.enums.StatutVente;

import lombok.Data;

@Data
public class VenteDTO {
    private UUID id;
    private LocalDateTime dateVente;
    private Double montantTotal;
    private StatutVente statut;
    private List<LigneVenteDTO> lignes;
    private String utilisateurNom;
}