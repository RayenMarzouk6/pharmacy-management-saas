package com.example.mangment_pfarmacy_v2.plan.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mangment_pfarmacy_v2.plan.dto.PlanTarifaireDTO;
import com.example.mangment_pfarmacy_v2.plan.entity.PlanTarifaire;
import com.example.mangment_pfarmacy_v2.plan.repository.PlanTarifaireRepository;

@Service
public class PlanTarifaireService {

    @Autowired
    private PlanTarifaireRepository planRepository;

    public PlanTarifaire createPlan(PlanTarifaireDTO dto) {
        PlanTarifaire plan = new PlanTarifaire();
        plan.setNom(dto.getNom());
        plan.setPrixMensuel(dto.getPrixMensuel());
        plan.setMaxUtilisateurs(dto.getMaxUtilisateurs());
        plan.setFeatures(dto.getFeatures());
        return planRepository.save(plan);
    }

    public List<PlanTarifaire> findAll() {
        return planRepository.findAll();
    }

    public Optional<PlanTarifaire> findById(UUID id) {
        return planRepository.findById(id);
    }

    public Optional<PlanTarifaire> findByNom(String nom) {
        return planRepository.findByNom(nom);
    }

    public PlanTarifaire updatePlan(UUID id, PlanTarifaireDTO dto) {
        PlanTarifaire plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        plan.setNom(dto.getNom());
        plan.setPrixMensuel(dto.getPrixMensuel());
        plan.setMaxUtilisateurs(dto.getMaxUtilisateurs());
        plan.setFeatures(dto.getFeatures());
        return planRepository.save(plan);
    }

    public void deletePlan(UUID id) {
        PlanTarifaire plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        planRepository.delete(plan);
    }
}
