package com.example.mangment_pfarmacy_v2.fournisseur.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.mangment_pfarmacy_v2.fournisseur.entity.Fournisseur;

@Repository
public interface FournisseurRepository extends JpaRepository<Fournisseur, UUID> {
    
    Page<Fournisseur> findByPharmacieId(UUID pharmacieId, Pageable pageable);
    
    Optional<Fournisseur> findByIdAndPharmacieId(UUID id, UUID pharmacieId);
    
    List<Fournisseur> findByPharmacieId(UUID pharmacieId);
    
    Page<Fournisseur> findByNomContainingIgnoreCaseAndPharmacieId(String nom, UUID pharmacieId, Pageable pageable);
}
