package com.example.mangment_pfarmacy_v2.plan.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.mangment_pfarmacy_v2.plan.entity.PlanTarifaire;

@Repository
public interface PlanTarifaireRepository extends JpaRepository<PlanTarifaire, UUID> {
    Optional<PlanTarifaire> findByNom(String nom);
}
