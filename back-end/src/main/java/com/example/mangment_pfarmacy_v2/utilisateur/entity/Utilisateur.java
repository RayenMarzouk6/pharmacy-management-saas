package com.example.mangment_pfarmacy_v2.utilisateur.entity;

import java.util.ArrayList;
import java.util.List;

// role stored as simple string for now; define enum if needed later

import org.hibernate.annotations.Filter;

import com.example.mangment_pfarmacy_v2.common.entity.BaseEntity;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.utilisateur.enums.Role;
import com.example.mangment_pfarmacy_v2.vente.entity.Vente;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "utilisateurs")
@Inheritance(strategy = jakarta.persistence.InheritanceType.JOINED)
@DiscriminatorColumn(name = "dtype" , discriminatorType = jakarta.persistence.DiscriminatorType.STRING)
@Filter(name = "tenantFilter", condition = "pharmacie_id = :pharmacieId")
@Getter
@Setter
public abstract class Utilisateur extends BaseEntity {

    @Column(nullable = false)
    private String first_name;

    @Column(nullable = false)
    private String last_name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacie_id" , nullable = false)
    private Pharmacie pharmacie;

    @JsonIgnore
    @OneToMany(mappedBy = "utilisateur", fetch = FetchType.LAZY)
    private List<Vente> ventes = new ArrayList<>();

    @JsonIgnore
    public Pharmacie getPharmacy() {
        return this.pharmacie;
    }

    public void setPharmacy(Pharmacie pharmacie) {
        this.pharmacie = pharmacie;
    }
}
 