package com.example.mangment_pfarmacy_v2.abonnement.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mangment_pfarmacy_v2.abonnement.dto.AbonnementDTO;
import com.example.mangment_pfarmacy_v2.abonnement.entity.Abonnement;
import com.example.mangment_pfarmacy_v2.abonnement.repository.AbonnementRepository;
import com.example.mangment_pfarmacy_v2.pharmacie.entity.Pharmacie;
import com.example.mangment_pfarmacy_v2.pharmacie.repository.PharmacieRepository;
import com.example.mangment_pfarmacy_v2.plan.entity.PlanTarifaire;
import com.example.mangment_pfarmacy_v2.plan.repository.PlanTarifaireRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AbonnementService {

    @Autowired
    private AbonnementRepository abonnementRepository;

    @Autowired
    private PlanTarifaireRepository planRepository;

    @Autowired
    private PharmacieRepository pharmacieRepository;

    @Transactional
    public Abonnement createAbonnement(AbonnementDTO dto) {
        PlanTarifaire plan = planRepository.findById(dto.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        
        Abonnement abonnement = new Abonnement();
        abonnement.setDateDebut(dto.getDateDebut());
        abonnement.setDateFin(dto.getDateFin());
        abonnement.setStatut(dto.getStatut());
        abonnement.setPlan(plan);
        Abonnement savedAbonnement = abonnementRepository.save(abonnement);

        if (dto.getPharmacieId() != null) {
            Pharmacie pharmacie = pharmacieRepository.findById(dto.getPharmacieId())
                    .orElseThrow(() -> new RuntimeException("Pharmacie not found"));
            pharmacie.setAbonnement(savedAbonnement);
            pharmacieRepository.save(pharmacie);
        }

        return savedAbonnement;
    }

    public List<Abonnement> findAll() {
        return abonnementRepository.findAll();
    }

    public Optional<Abonnement> findById(UUID id) {
        return abonnementRepository.findById(id);
    }

    public Abonnement updateAbonnement(UUID id, AbonnementDTO dto) {
        Abonnement abonnement = abonnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement not found"));
        
        if (dto.getPlanId() != null && !dto.getPlanId().equals(abonnement.getPlan().getId())) {
            PlanTarifaire plan = planRepository.findById(dto.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Plan not found"));
            abonnement.setPlan(plan);
        }
        
        abonnement.setDateDebut(dto.getDateDebut());
        abonnement.setDateFin(dto.getDateFin());
        abonnement.setStatut(dto.getStatut());
        return abonnementRepository.save(abonnement);
    }

    public void deleteAbonnement(UUID id) {
        Abonnement abonnement = abonnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement not found"));
        abonnementRepository.delete(abonnement);
    }
}
