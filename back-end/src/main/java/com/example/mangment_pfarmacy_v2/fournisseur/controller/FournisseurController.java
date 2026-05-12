package com.example.mangment_pfarmacy_v2.fournisseur.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mangment_pfarmacy_v2.common.security.TenantContext;
import com.example.mangment_pfarmacy_v2.fournisseur.dto.FournisseurDTO;
import com.example.mangment_pfarmacy_v2.fournisseur.entity.Fournisseur;
import com.example.mangment_pfarmacy_v2.fournisseur.service.FournisseurService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fournisseurs")
@PreAuthorize("isAuthenticated()")
public class FournisseurController {

    @Autowired
    private FournisseurService fournisseurService;

    @PostMapping
    public ResponseEntity<Fournisseur> create(@Valid @RequestBody FournisseurDTO dto) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();
        
        Fournisseur created = fournisseurService.createFournisseur(dto, pharmacieId);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<Page<Fournisseur>> list(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();

        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(fournisseurService.searchByNom(search, pharmacieId, pageable));
        } else {
            return ResponseEntity.ok(fournisseurService.listFournisseurs(pharmacieId, pageable));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fournisseur> get(@PathVariable UUID id) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();

        return fournisseurService.findById(id, pharmacieId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fournisseur> update(@PathVariable UUID id, @RequestBody FournisseurDTO dto) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();

        try {
            Fournisseur updated = fournisseurService.updateFournisseur(id, dto, pharmacieId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        UUID pharmacieId = TenantContext.getPharmacieId();
        if (pharmacieId == null) return ResponseEntity.status(403).build();

        try {
            fournisseurService.deleteFournisseur(id, pharmacieId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
