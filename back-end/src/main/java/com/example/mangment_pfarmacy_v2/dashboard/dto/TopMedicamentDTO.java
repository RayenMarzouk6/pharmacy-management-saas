package com.example.mangment_pfarmacy_v2.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopMedicamentDTO {
    private String medicamentNom;
    private Long quantiteVendue;
}
