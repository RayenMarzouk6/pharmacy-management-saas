package com.example.mangment_pfarmacy_v2.pharmacie.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import com.example.mangment_pfarmacy_v2.abonnement.entity.Abonnement;
import com.example.mangment_pfarmacy_v2.fournisseur.entity.Fournisseur;
import com.example.mangment_pfarmacy_v2.medicament.entity.Medicament;
import com.example.mangment_pfarmacy_v2.superadmin.entity.SuperAdmin;
import com.example.mangment_pfarmacy_v2.utilisateur.entity.Utilisateur;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pharmacie")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "pharmacieId", type = UUID.class))
@Getter
@Setter
public class Pharmacie {

    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String adresse;

    @Column(length = 20)
    private String telephone;

    @Column(unique = true, nullable = false)
    private String tenantId;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "abonnement_id", unique = true)
    private Abonnement abonnement;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "super_admin_id")
    private SuperAdmin superAdmin;

    @JsonIgnore
    @OneToMany(mappedBy = "pharmacie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Utilisateur> utilisateurs = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "pharmacie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Medicament> medicaments = new ArrayList<>();


    @JsonIgnore
    @OneToMany(mappedBy = "pharmacie", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Fournisseur> fournisseurs = new ArrayList<>();


    public boolean isAbonnementActif() {
        return this.abonnement != null && this.abonnement.isActif();
    }
}
