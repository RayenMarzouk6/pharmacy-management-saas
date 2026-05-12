package com.example.mangment_pfarmacy_v2.plan.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.example.mangment_pfarmacy_v2.abonnement.entity.Abonnement;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "plan_tarifaire")
@Getter
@Setter
public class PlanTarifaire {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique=true, name = "nom", nullable = false)
    private String nom; // STARTER, PREMIUM, ENTERPRISE

    @Column(nullable = false)
    private double prixMensuel; // Prix mensuel du plan tarifaire

    @Column(nullable = false)
    private Integer maxUtilisateurs ;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "plan_tarifaire_features", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "feature")
    private List<String> features; // Liste des fonctionnalités incluses dans le plan tarifaire

    @JsonIgnore
    @OneToMany(mappedBy = "plan" , fetch = FetchType.LAZY)
    private List<Abonnement> abonnements = new ArrayList<>(); // Liste des abonnements associés à ce plan tarifaire
}
