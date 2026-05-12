package com.example.mangment_pfarmacy_v2.utilisateur.controller;

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

import com.example.mangment_pfarmacy_v2.common.security.TenantContext;
import com.example.mangment_pfarmacy_v2.utilisateur.dto.UtilisateurDTO;
import com.example.mangment_pfarmacy_v2.utilisateur.entity.Pharmacien;
import com.example.mangment_pfarmacy_v2.utilisateur.service.UtilisateurService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pharmaciens")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Pharmacien> createPharmacien(@Valid @RequestBody UtilisateurDTO dto) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) {
            return ResponseEntity.status(403).build();
        }

        Pharmacien created = utilisateurService.createPharmacien(dto, pharmacieId);
        return ResponseEntity.ok(created);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<List<?>> listPharmaciens() {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(utilisateurService.listPharmaciensByPharmacie(pharmacieId));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(utilisateurService.findById(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody UtilisateurDTO dto) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();
        try {
            Pharmacien updated = utilisateurService.updatePharmacien(id, dto, pharmacieId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(403).body(ex.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();
        try {
            // Ensure the utilisateur belongs to the same pharmacie
            var utilisateur = utilisateurService.findById(id);
            if (!utilisateur.getPharmacy().getId().equals(pharmacieId)) {
                return ResponseEntity.status(403).build();
            }
            utilisateurService.deleteUtilisateur(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
