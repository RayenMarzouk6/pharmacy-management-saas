package com.example.mangment_pfarmacy_v2.utilisateur.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin_pharmacies")
@DiscriminatorValue("ADMIN")
public class AdminPharmacie extends Utilisateur {
    // Champs spécifiques à l'administrateur de pharmacie
    @Column
    private String niveauAcces; // FULL  READ_ONLY
}
