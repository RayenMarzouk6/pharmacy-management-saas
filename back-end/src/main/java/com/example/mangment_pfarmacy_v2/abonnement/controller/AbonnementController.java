package com.example.mangment_pfarmacy_v2.abonnement.controller;

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

import com.example.mangment_pfarmacy_v2.abonnement.dto.AbonnementDTO;
import com.example.mangment_pfarmacy_v2.abonnement.entity.Abonnement;
import com.example.mangment_pfarmacy_v2.abonnement.service.AbonnementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/abonnements")
public class AbonnementController {

    @Autowired
    private AbonnementService abonnementService;

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<Abonnement> createAbonnement(@Valid @RequestBody AbonnementDTO dto) {
        Abonnement created = abonnementService.createAbonnement(dto);
        return ResponseEntity.ok(created);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Abonnement>> listAbonnements() {
        List<Abonnement> abonnements = abonnementService.findAll();
        return ResponseEntity.ok(abonnements);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<Abonnement> getAbonnement(@PathVariable UUID id) {
        return abonnementService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Abonnement> updateAbonnement(@PathVariable UUID id, @RequestBody AbonnementDTO dto) {
        try {
            Abonnement updated = abonnementService.updateAbonnement(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAbonnement(@PathVariable UUID id) {
        try {
            abonnementService.deleteAbonnement(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
