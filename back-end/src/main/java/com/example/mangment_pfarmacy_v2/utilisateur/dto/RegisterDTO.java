package com.example.mangment_pfarmacy_v2.utilisateur.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {

    @NotBlank(message = "Le prenom est requis")
    private String firstName;

    @NotBlank(message = "Le nom est requis")
    private String lastName;

    @NotBlank(message = "L'email est requis")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caracteres")
    private String password;

    // Pharmacy details
    @NotBlank(message = "Le nom de la pharmacie est requis")
    private String pharmacyName;

    @NotBlank(message = "L'adresse de la pharmacie est requise")
    private String pharmacyAddress;

    @NotBlank(message = "Le numero de telephone est requis")
    private String phoneNumber;
}