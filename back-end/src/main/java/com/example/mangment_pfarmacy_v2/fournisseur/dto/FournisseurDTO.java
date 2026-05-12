package com.example.mangment_pfarmacy_v2.fournisseur.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class FournisseurDTO {
    private UUID id;
    private String nom;
    private String telephone;
    private String email;
    private String adresse;
}
