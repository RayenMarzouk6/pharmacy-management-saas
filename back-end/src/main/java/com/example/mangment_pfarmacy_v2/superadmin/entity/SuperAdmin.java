package com.example.mangment_pfarmacy_v2.superadmin.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "super_admins")
@Getter
@Setter
public class SuperAdmin {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "SUPER_ADMIN";

    @OneToMany(mappedBy = "superAdmin", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Pharmacie> pharmacies = new ArrayList<>();
}
