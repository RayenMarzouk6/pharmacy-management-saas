package com.example.mangment_pfarmacy_v2.abonnement.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.mangment_pfarmacy_v2.abonnement.entity.Abonnement;
import com.example.mangment_pfarmacy_v2.abonnement.enums.StatutAbonnement;

@Repository
public interface AbonnementRepository extends JpaRepository<Abonnement, UUID> {
	long countByStatut(StatutAbonnement statut);
}
