package com.example.mangment_pfarmacy_v2.utilisateur.dto;

import java.util.UUID;

import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;

import lombok.Data;

@Data
public class UtilisateurDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Role role;
    private UUID pharmacieId;
    private String matricule;
    private String specialite;
}
