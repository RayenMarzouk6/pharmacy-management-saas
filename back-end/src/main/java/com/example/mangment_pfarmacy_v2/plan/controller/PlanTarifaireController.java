package com.example.mangment_pfarmacy_v2.plan.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mangment_pfarmacy_v2.plan.dto.PlanTarifaireDTO;
import com.example.mangment_pfarmacy_v2.plan.entity.PlanTarifaire;
import com.example.mangment_pfarmacy_v2.plan.service.PlanTarifaireService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/plans")
public class PlanTarifaireController {

    @Autowired
    private PlanTarifaireService planService;

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<PlanTarifaire> createPlan(@Valid @RequestBody PlanTarifaireDTO dto) {
        PlanTarifaire created = planService.createPlan(dto);
        return ResponseEntity.ok(created);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<PlanTarifaire>> listPlans() {
        List<PlanTarifaire> plans = planService.findAll();
        return ResponseEntity.ok(plans);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<PlanTarifaire> getPlan(@PathVariable UUID id) {
        return planService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PlanTarifaire> updatePlan(@PathVariable UUID id, @RequestBody PlanTarifaireDTO dto) {
        try {
            PlanTarifaire updated = planService.updatePlan(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable UUID id) {
        try {
            planService.deletePlan(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
