package com.example.mangment_pfarmacy_v2.vente.dto;

import com.example.mangment_pfarmacy_v2.vente.enums.StatutVente;

import lombok.Data;

@Data
public class VenteUpdateDTO {
    private StatutVente statut;
}
