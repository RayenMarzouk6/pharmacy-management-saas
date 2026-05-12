package com.example.mangment_pfarmacy_v2.medicament.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.mangment_pfarmacy_v2.medicament.entity.Medicament;

public interface MedicamentRepository
        extends JpaRepository<Medicament, UUID> {
 
    // ᓚᘏᗢ  JPQL (@Query)
    @Query("SELECT m FROM Medicament m WHERE LOWER(m.nom) LIKE LOWER(CONCAT('%',:nom,'%'))"
           + " AND m.pharmacie.id = :pharId")
    Page<Medicament> findByNom(@Param("nom") String nom,
                               @Param("pharId") UUID pharId,
                               Pageable pageable);


    @Query("Select m from Medicament m where m.dateExpiration < :date")
    List<Medicament> findExpiringBefore(@Param("date") LocalDate date , @Param("pharmacieId") UUID pharmacieId);                           

    // ᓚᘏᗢ  Derived Query
    Page<Medicament> findByNomContainingIgnoreCaseAndPharmacieId(String nom, UUID pharmacieId, Pageable pageable);

    // ᓚᘏᗢ  Derived Query + pagination
    Page<Medicament> findByPharmacieId(UUID pharmacieId, Pageable pageable);

    Optional<Medicament> findByIdAndPharmacieId(UUID id, UUID pharmacieId);
 
    // Stock faible
    @Query("SELECT m FROM Medicament m WHERE m.quantiteStock <= m.seuilAlerte"
           + " AND m.pharmacie.id = :pharId")
    List<Medicament> findStockFaible(@Param("pharId") UUID pharId);
 
    // Médicaments expirés ou proches expiration
    List<Medicament> findByDateExpirationBeforeAndPharmacieId(
        LocalDate date, UUID pharmacieId);
 
    List<Medicament> findByPharmacieIdAndQuantiteStockLessThanEqual(UUID pharmacieId, Integer threshold);
 
    // Par code-barres
    Optional<Medicament> findByCodeBarresAndPharmacieId(
        String codeBarres, UUID pharmacieId);
}

