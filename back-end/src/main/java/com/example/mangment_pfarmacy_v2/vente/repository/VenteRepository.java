package com.example.mangment_pfarmacy_v2.vente.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.mangment_pfarmacy_v2.vente.entity.Vente;

public interface VenteRepository
        extends JpaRepository<Vente, UUID> {
 
       @Query("SELECT v FROM Vente v WHERE v.id = :id AND v.pharmacie.id = :pharmacieId")
    Optional<Vente> findByIdAndPharmacieId(UUID id, UUID pharmacieId);
    
       @Query("SELECT v FROM Vente v WHERE v.pharmacie.id = :pharmacieId")
    Page<Vente> findByPharmacieId(UUID pharmacieId, Pageable pageable);
    
    // Ventes par pharmacien
       @Query("SELECT v FROM Vente v WHERE v.utilisateur.id = :userId AND v.pharmacie.id = :pharId")
    Page<Vente> findByUtilisateurIdAndPharmacieId(
        UUID userId, UUID pharId, Pageable pageable);
 
    // Ventes entre deux dates (dashboard)
    @Query("SELECT v FROM Vente v WHERE v.pharmacie.id = :pharId"
           + " AND v.dateVente BETWEEN :debut AND :fin")
    List<Vente> findByPeriode(@Param("pharId") UUID pharId,
                              @Param("debut") LocalDateTime debut,
                              @Param("fin") LocalDateTime fin);
 
    // CA journalier
    @Query("SELECT SUM(v.montantTotal) FROM Vente v"
           + " WHERE v.pharmacie.id = :pharId"
           + " AND v.dateVente BETWEEN :start AND :end")
    Double chiffreAffairesJour(@Param("pharId") UUID pharId,
                               @Param("start") LocalDateTime start,
                               @Param("end") LocalDateTime end);
    
    // Top medicaments vendus
    @Query(value = "SELECT m.id, m.nom, SUM(lv.quantite) as total_qty FROM lignes_vente lv "
           + "JOIN medicaments m ON lv.medicament_id = m.id "
           + "JOIN ventes v ON lv.vente_id = v.id "
           + "WHERE v.pharmacie_id = :pharId AND v.date_vente >= :debut "
           + "GROUP BY m.id, m.nom ORDER BY total_qty DESC", nativeQuery = true)
    List<Object[]> topMedicamentsByPeriod(@Param("pharId") UUID pharId,
                                          @Param("debut") LocalDateTime debut);

    @Query("SELECT CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) AS pharmacienNom, "
           + "COALESCE(SUM(v.montantTotal), 0), COUNT(v) "
           + "FROM Vente v JOIN v.utilisateur u "
           + "WHERE v.pharmacie.id = :pharId AND v.dateVente BETWEEN :debut AND :fin "
           + "GROUP BY u.id, u.first_name, u.last_name "
           + "ORDER BY COALESCE(SUM(v.montantTotal), 0) DESC")
    List<Object[]> ventesByPharmacienBetween(@Param("pharId") UUID pharId,
                                             @Param("debut") LocalDateTime debut,
                                             @Param("fin") LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(v.montantTotal), 0) FROM Vente v")
    Double sumMontantTotal();

    @Query("SELECT v.pharmacie.id, v.pharmacie.nom, COUNT(v), COALESCE(SUM(v.montantTotal), 0) "
           + "FROM Vente v GROUP BY v.pharmacie.id, v.pharmacie.nom "
           + "ORDER BY COALESCE(SUM(v.montantTotal), 0) DESC")
    List<Object[]> salesByPharmacie();
}
