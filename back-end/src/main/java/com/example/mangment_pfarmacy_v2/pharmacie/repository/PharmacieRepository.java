package com.example.mangment_pfarmacy_v2.pharmacie.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;

@Repository
public interface PharmacieRepository extends JpaRepository<Pharmacie, UUID> {
    Optional<Pharmacie> findByTenantId(String tenantId);
}
