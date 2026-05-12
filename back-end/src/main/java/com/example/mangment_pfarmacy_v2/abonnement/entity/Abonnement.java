package com.example.mangment_pfarmacy_v2.abonnement.entity;

import java.time.LocalDate;
import java.util.UUID;

import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.plan.entity.PlanTarifaire;
import com.example.mangment_pfarmacy_v2.abonnement.enums.StatutAbonnement;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name="abonnements")
@Getter
@Setter
public class Abonnement {

    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDate dateDebut;


    @Column(nullable = false)
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutAbonnement statut; // ACTIF, SUSPENDU, EXPIRE

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id", nullable = false)
    private PlanTarifaire plan;


    @JsonIgnore
    @OneToOne(mappedBy = "abonnement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Pharmacie pharmacie;

    public boolean isActif() {
        LocalDate now = LocalDate.now();
        return this.statut == StatutAbonnement.ACTIF
                && !now.isBefore(this.dateDebut)
                && !now.isAfter(this.dateFin);
    }
}
