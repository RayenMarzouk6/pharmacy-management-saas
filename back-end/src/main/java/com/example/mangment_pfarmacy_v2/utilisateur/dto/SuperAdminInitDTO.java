package com.example.mangment_pfarmacy_v2.utilisateur.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminInitDTO {

    @NotBlank(message = "Le prenom est requis")
    private String firstName;

    @NotBlank(message = "Le nom est requis")
    private String lastName;

    @NotBlank(message = "L'email est requis")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    private String password;

    @NotBlank(message = "Nom de la pharmacie est requis")
    private String pharmacyName;

    @NotBlank(message = "Adresse de la pharmacie est requise")
    private String pharmacyAddress;

    private String phoneNumber;

    @NotBlank(message = "Clé d'initialisation (initSecret) est requise")
    private String initSecret;
}
