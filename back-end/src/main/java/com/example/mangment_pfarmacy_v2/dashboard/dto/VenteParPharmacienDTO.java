package com.example.mangment_pfarmacy_v2.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VenteParPharmacienDTO {
    private String pharmacienNom;
    private Double montantTotal;
    private Integer nombreVentes;
}
