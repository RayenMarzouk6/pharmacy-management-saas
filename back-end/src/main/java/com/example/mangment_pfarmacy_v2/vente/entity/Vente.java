package com.example.mangment_pfarmacy_v2.vente.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;

import com.example.mangment_pfarmacy_v2.common.entity.BaseEntity;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.utilisateur.entity.Utilisateur;
import com.example.mangment_pfarmacy_v2.vente.enums.StatutVente;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ventes",
       indexes = { @Index(name = "idx_vente_pharmacie", columnList = "pharmacie_id"),
                   @Index(name = "idx_vente_date", columnList = "date_vente") })
@Filter(name = "tenantFilter", condition = "pharmacie_id = :pharmacieId")
@Getter
@Setter
public class Vente extends BaseEntity {
 
    @CreationTimestamp
    @Column(name = "date_vente", nullable = false, updatable = false)
    private LocalDateTime dateVente;
 
    @Column(nullable = false)
    private Double montantTotal;
 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutVente statut;  // EN_COURS, VALIDEE, ANNULEE

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;   // Pharmacien qui vend
 
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacie_id", nullable = false)
    private Pharmacie pharmacie;

    @Transient
    private java.util.UUID pharmacieId;
 
    @OneToMany(mappedBy = "vente",
               cascade = CascadeType.ALL,
               orphanRemoval = true,
               fetch = FetchType.EAGER)
    private List<LigneVente> lignesVente = new ArrayList<>();
 
    public Double calculerTotal() {
        return lignesVente.stream()
                .mapToDouble(LigneVente::sousTotal)
                .sum();
    }

    public void setPharmacieId(java.util.UUID pharmacieId) {
        this.pharmacieId = pharmacieId;
    }
}
 
