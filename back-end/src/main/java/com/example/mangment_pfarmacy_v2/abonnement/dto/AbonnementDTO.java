package com.example.mangment_pfarmacy_v2.abonnement.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.example.mangment_pfarmacy_v2.abonnement.enums.StatutAbonnement;

import lombok.Data;

@Data
public class AbonnementDTO {
    private UUID id;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private StatutAbonnement statut;
    private UUID planId;
    private UUID pharmacieId;
}
