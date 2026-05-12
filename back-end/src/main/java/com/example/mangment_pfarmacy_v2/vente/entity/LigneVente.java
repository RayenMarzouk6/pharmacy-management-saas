package com.example.mangment_pfarmacy_v2.vente.entity;

import com.example.mangment_pfarmacy_v2.common.entity.BaseEntity;
import com.example.mangment_pfarmacy_v2.medicament.entity.Medicament;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "lignes_vente")
@Getter
@Setter
public class LigneVente extends BaseEntity {
 
    @Column(nullable = false)
    private Integer quantite;
 
    @Column(nullable = false)
    private Double prixUnitaire;  // Snapshot prix au moment de la vente
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vente_id", nullable = false)
    private Vente vente;
 
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medicament_id", nullable = false)
    private Medicament medicament;
 
    public Double sousTotal() {
        return quantite * prixUnitaire;
    }
}