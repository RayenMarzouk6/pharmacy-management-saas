package com.example.mangment_pfarmacy_v2.medicament.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.mangment_pfarmacy_v2.common.entity.BaseEntity;
import com.example.mangment_pfarmacy_v2.fournisseur.entity.Fournisseur;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.vente.entity.LigneVente;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Index;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "medicaments", indexes = {@Index(name = "idx_med_nom", columnList = "nom"), @Index(name = "idx_med_pharmacie", columnList = "pharmacie_id")})
@NamedQuery(name = "Medicament.findExpiringBefore", query = "SELECT m FROM Medicament m WHERE m.dateExpiration < :date AND m.pharmacie.id = :pharmacieId")
@Getter
@Setter
public class Medicament extends BaseEntity {

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String imageUrl;

    @Column(length = 200)
    private String description;

    @Column(nullable = false)
    private Double prix;

    @Column(nullable = false)
    private Integer quantiteStock;

    @Column(nullable = false)
    private Integer seuilAlerte; // /!\ Alerte si stock < seuilAlerte

    @Column(nullable = false)
    private LocalDate dateExpiration;

    @Column
    private String codeBarres;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacie_id" , nullable = false)
    private Pharmacie pharmacie;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    @JsonIgnore
    @OneToMany(mappedBy = "medicament", fetch = FetchType.LAZY)
    private List<LigneVente> lignesVente = new ArrayList<>();

    public boolean estExpire() {
        return LocalDate.now().isAfter(dateExpiration);
    }
 
    public boolean alerteStockFaible() {
        return quantiteStock <= seuilAlerte;
    }

    @JsonIgnore
    public Pharmacie getPharmacy() {
        return this.pharmacie;
    }

    public void setPharmacy(Pharmacie pharmacie) {
        this.pharmacie = pharmacie;
    }
}