package com.example.mangment_pfarmacy_v2.vente.dto;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LigneVenteDTO {
    @NotNull(message = "Le médicament est obligatoire")
    private UUID medicamentId;

    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 1, message = "La quantité doit être supérieure à 0")
    private Integer quantite;

    private Double prixUnitaire;
    private UUID venteId;
}