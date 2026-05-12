package com.example.mangment_pfarmacy_v2.fournisseur.entity;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Filter;

import com.example.mangment_pfarmacy_v2.common.entity.BaseEntity;
import com.example.mangment_pfarmacy_v2.medicament.entity.Medicament;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "fournisseurs")
@Filter(name = "tenantFilter", condition = "pharmacie_id = :pharmacieId")
@Getter
@Setter
public class Fournisseur extends BaseEntity {

	@Column(nullable = false)
	private String nom;

    @Column(length = 20)
    private String telephone;

    @Column
    private String email;

    @Column
    private String adresse;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pharmacie_id" , nullable = false)
	private Pharmacie pharmacie;

    @JsonIgnore
    @OneToMany(mappedBy = "fournisseur", fetch = FetchType.LAZY)
    private List<Medicament> medicaments = new ArrayList<>();

    @JsonIgnore
    public Pharmacie getPharmacy() {
        return this.pharmacie;
    }

    public void setPharmacy(Pharmacie pharmacie) {
        this.pharmacie = pharmacie;
    }
}
