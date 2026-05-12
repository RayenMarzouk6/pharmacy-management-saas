package com.example.mangment_pfarmacy_v2.medicament.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mangment_pfarmacy_v2.medicament.dto.AlerteDTO;
import com.example.mangment_pfarmacy_v2.medicament.entity.Medicament;
import com.example.mangment_pfarmacy_v2.medicament.repository.MedicamentRepository;

@Service
@Transactional(readOnly = true)
public class AlerteService {

    @Autowired
    private MedicamentRepository medicamentRepository;

    /**
     * Trouve tous les médicaments avec stock faible
     */
    public List<AlerteDTO> findStockFaibleAlertes(UUID pharmacieId) {
        List<Medicament> medicaments = medicamentRepository.findStockFaible(pharmacieId);
        List<AlerteDTO> alertes = new ArrayList<>();
        
        for (Medicament m : medicaments) {
            alertes.add(new AlerteDTO(
                m.getId(),
                m.getNom(),
                "STOCK_FAIBLE",
                m.getDateExpiration(),
                m.getQuantiteStock(),
                m.getSeuilAlerte()
            ));
        }
        
        return alertes;
    }

    /**
     * Trouve tous les médicaments expirant dans X jours
     */
    public List<AlerteDTO> findExpiringAlertes(UUID pharmacieId, int daysFromNow) {
        LocalDate threshold = LocalDate.now().plusDays(daysFromNow);
        List<Medicament> medicaments = medicamentRepository.findByDateExpirationBeforeAndPharmacieId(threshold, pharmacieId);
        List<AlerteDTO> alertes = new ArrayList<>();
        
        for (Medicament m : medicaments) {
            alertes.add(new AlerteDTO(
                m.getId(),
                m.getNom(),
                "EXPIRE_SOON",
                m.getDateExpiration(),
                m.getQuantiteStock(),
                m.getSeuilAlerte()
            ));
        }
        
        return alertes;
    }

    /**
     * Combine stock faible et alertes d'expiration (déduplication)
     */
    public List<AlerteDTO> findAllAlertes(UUID pharmacieId, int expirationDaysThreshold) {
        List<AlerteDTO> stockAlertes = findStockFaibleAlertes(pharmacieId);
        List<AlerteDTO> expiringAlertes = findExpiringAlertes(pharmacieId, expirationDaysThreshold);
        
        // Utilise un Set pour éviter les doublons (même médicament avec deux alertes)
        Set<UUID> seenIds = new HashSet<>();
        List<AlerteDTO> combined = new ArrayList<>();
        
        for (AlerteDTO alerte : stockAlertes) {
            combined.add(alerte);
            seenIds.add(alerte.getMedicamentId());
        }
        
        for (AlerteDTO alerte : expiringAlertes) {
            if (!seenIds.contains(alerte.getMedicamentId())) {
                combined.add(alerte);
            }
        }
        
        return combined;
    }
}
