package com.example.mangment_pfarmacy_v2.utilisateur.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pharmaciens")
@DiscriminatorValue("PHARMACIEN")
@Getter
@Setter
public class Pharmacien extends Utilisateur {
    
    @Column
    private String matricule; // Identifiant unique du pharmacien
    @Column
    private String specialite; // Ex: Généraliste, Pédiatrique, etc.
}  