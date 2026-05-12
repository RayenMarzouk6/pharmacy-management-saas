package com.example.mangment_pfarmacy_v2.vente.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class VenteCreateDTO {
    @NotEmpty(message = "Les lignes de vente sont obligatoires")
    @Valid
    private List<LigneVenteDTO> lignes;
}